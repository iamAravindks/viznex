import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Ad from "../models/AdModel.js";
import Customer from "../models/customerSchema.js";
import Device from "../models/DeviceModel.js";
import Operator from "../models/OperatorModel.js";
import generateToken from "../utils/utils.js";

class DeviceNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = "DeviceNotFound";
  }
}

class DeviceNotUpdate extends Error {
  constructor(deviceId) {
    super(deviceId);
    this.name = "DeviceNotUpdate";
  }
}

// @desc Operator login
// @access Private

export const operatorLogin = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(200).json({ message: "Operator fields are required" });
  }

  try {
    const operator = await Operator.findOne({ email }).populate(
      "adsUnderOperator.ad"
    );

    if (!operator) {
      res.status(404);
      throw new Error(`No operator with email ${email} found`);
    }

    if (operator && (await operator.matchPassword(password))) {
      const maxAge = 3 * 24 * 60 * 60;
      const token = generateToken(operator._id);
      res.cookie("Viznx_Secure_Session_ID", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      });
      res.cookie("Viznx_operator_Status", operator._id, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      });
      res.status(201).json(operator.toJSON());
    } else {
      res.status(401);
      throw new Error("Invalid password or email");
    }
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error ");
  }
});

// @desc Get all operators
// @route GET /api/operator/load-operators
// @access Private

export const fetchOperators = expressAsyncHandler(async (req, res) => {
  try {
    const operators = await Operator.find({}).select("name email location");
    res.status(200).json(operators);
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

// @desc Get Profile of the operator
// @access Private

export const loadProfile = expressAsyncHandler(async (req, res) => {
  try {
    const operator = await Operator.findById(req.operator.id).populate(
      "adsUnderOperator.ad"
    );
    res.status(200).json(operator.toJSON());
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

// @desc Add an ad
// @access Private

const addToDevices = async (slots = [], devices, ad, operator, adFrequency) => {
  try {
    const updatePromises = devices.map(async (_id) => {
      // check whether the ad is also present in the device
      const device = await Device.findOne({
        _id: new mongoose.Types.ObjectId(_id),
        slots: {
          $elemMatch: {
            name: { $in: slots },
            "queue.ad": ad._id,
            "queue.operator": operator._id,
          },
        },
      });

      if (device) {
        return { _id }; // skip adding the device if it already exists in the array
      } else {
        const updateResult = await Device.updateMany(
          {
            _id: new mongoose.Types.ObjectId(_id),
          },
          {
            $addToSet: {
              "slots.$[slot].queue": {
                ad: ad._id,
                operator: operator._id,
                adFrequency: adFrequency,
              },
            },
          },
          {
            arrayFilters: slots.map((s) => ({ "slot.name": s })),
          }
        );

        console.log(`${updateResult.nModified} documents updated`);

        if (updateResult.nModified === 0) {
          throw new DeviceNotFound(`Device ${_id} not found`);
        } else {
          return { _id };
        }
      }
    });
    const updatedDevices = await Promise.all(updatePromises);
    // await sessionMong.commitTransaction();
    return updatedDevices;
  } catch (error) {
    // await sessionMong.abortTransaction();
    if (error instanceof DeviceNotFound) {
      throw error;
    } else {
      console.log(error);
      const deviceId = error?.message?.split(" ")[2];
      throw new DeviceNotUpdate(deviceId, error?.message);
    }
  } finally {
    // sessionMong.endSession();
  }
};

export const addTheAdToQueue = expressAsyncHandler(async (req, res) => {
  const {
    name,
    customerEmail,
    url,
    devices,
    startDate,
    endDate,
    slots,
    adFrequency,
  } = req.body;

  if (
    !name ||
    !customerEmail ||
    !url ||
    !devices ||
    !startDate ||
    !endDate ||
    !slots ||
    !adFrequency
  ) {
    return res
      .status(200)
      .json({ message: "sufficient values didn't provide" });
  }

  try {
    // check whether the customer is there

    const customer = await Customer.findOne({ email: customerEmail }).select(
      "-password -passwordResetToken -passwordResetExpires"
    );

    const operator = await Operator.findById(req.operator.id).select(
      "-password -passwordResetToken -passwordResetExpires"
    );

    if (!customer) {
      res.status(404);
      throw new Error(`there is no customer with ${customerEmail}`);
    }

    // check the ad is already in there
    let ad = await Ad.findOne({
      name,
      url,
      operator: operator._id,
      customer: customer._id,
    });

    if (!ad) {
      ad = await Ad.create({
        name,
        url,
        operator: operator._id,
        customer: customer._id,
      });
    }

    // set up the devices queue according to the session
    const successFullUpdate = await addToDevices(
      slots,
      devices,
      ad,
      operator,
      adFrequency
    );

    console.log({ successFullUpdate });
    if (
      successFullUpdate.length !== devices.length ||
      !successFullUpdate.every((device) => devices.includes(device._id))
    ) {
      throw new Error("Error on device update with queue");
    }

    // update the customer's ads section, avoid the duplication

    await Customer.updateOne(
      { _id: customer._id },
      { $addToSet: { ads: { $each: [ad._id] } } }
    );

    const devicesObj = devices.map((deviceId) => {
      return {
        _id: new mongoose.Types.ObjectId(deviceId),
        type: mongoose.Types.ObjectId,
        ref: "Device",
        totalPlayHrs: 0,
      };
    });

    await Customer.updateOne(
      { _id: customer._id },
      { $addToSet: { devices: devicesObj } }
    );
    // avoid the duplication
    // Check if the ad already exists under the operator

    // for that create an array with combinations of both devices and slots

    const combinationDeployedDevices = slots.flatMap((slot) =>
      devices.map((deviceId) => ({
        device: new mongoose.Types.ObjectId(deviceId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        slot: {
          slotType: slot,
        }, // only include the slotType value as a string
      }))
    );

    const existingAdIndex = operator.adsUnderOperator.findIndex(
      (adObj) => adObj.ad.toString() === ad._id.toString()
    );

    // if an ad with id present
    if (existingAdIndex !== -1) {
      const deployedDevices = combinationDeployedDevices.filter((device) => {
        // check if the device with a deviceId and slot is already present
        const existingDeviceIndex = operator.adsUnderOperator[
          existingAdIndex
        ].deployedDevices.findIndex(
          (item) =>
            item.device.toString() === device.device.toString() &&
            item.slot.slotType === device.slot.slotType
        );
        // return false if it's already present, true otherwise
        return existingDeviceIndex === -1;
      });

      // add new devices to the existing ad
      operator.adsUnderOperator[existingAdIndex].deployedDevices.push(
        ...deployedDevices.map((device) => ({
          device: new mongoose.Types.ObjectId(device.device),
          startDate: device.startDate,
          endDate: device.endDate,
          slot: {
            slotType: device.slot.slotType,
          },
        }))
      );
    } else {
      // The ad does not exist, create a new ad object and push it to the adsUnderOperator array

      operator.adsUnderOperator.push({
        ad: ad._id,
        deployedDevices: combinationDeployedDevices,
      });
    }

    await operator.save();

    res.status(200).json(operator.toJSON());
  } catch (error) {
    console.log(error);
    throw new Error(error.message ? error.message : "Internal server error ");
  }
});

export const createCustomer = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(200).json({
      message: "Customer fields are required",
    });
  }

  try {
    const customerExists = await Customer.findOne({ email });

    if (customerExists) {
      res.status(400);
      throw new Error(`Customer with email id ${email} is already exists`);
    }
    const customer = await Customer.create({
      name,
      email,
      password,
    });
    if (customer) {
      const customers = await Customer.find({}).select(
        "-password -passwordResetToken -passwordResetExpires"
      );
      res.status(201).json(customers);
    } else {
      res.status(500);
      throw new Error("Oops, something is not working! try again");
    }
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

export const updateQueue = expressAsyncHandler(async (req, res) => {
  try {
    // fetch the queue with ad id and slot name
    const { ad, slotType, customerEmail, url, startDate, endDate, devices } =
      req.body;
    const operator = await Operator.findById(req.operator._id);
    const customer = await Customer.findOne({
      customerEmail,
    });

    // first update the ad url , for that
    if (url) {
      const updateAd = await Ad.updateOne(
        {
          _id: ad,
        },
        {
          $set: {
            url,
          },
        }
      );
    }

    // if (startDate || endDate)
    // {
    //   operator.adsUnderOperator.forEach(item =>
    //   {
    //     if (item.ad.toString() === ad.toString())
    //     {
    //       item.deployedDevices.forEach(device =>
    //       {
    //         if (device.slot.slotType === slot)
    //         {
    //           if (startDate)
    //           {
    //             device.startDate = new Date(startDate)
    //           }
    //           if (endDate)
    //           {
    //             device.endDate = new Date(endDate);
    //           }
    //         }
    //       })
    //     }
    //   })

    //   operator.save()
    // }

    const alreadyDeployedDevices = operator.adsUnderOperator.filter(
      (item) =>
        item.ad.toString() === ad.toString() &&
        item.deployedDevices.every(
          (device) => device.slot.slotType === slotType
        )
    );

    // const newDeployedDevices = alreadyDeployedDevices[0].deployedDevices.map(
    //   (device) => {
    //     const existingDeviceIndex = devices.findIndex(
    //       (d) => d.toString() === device.device.toString()
    //     );

    //     // check whether if not existing in the devices and deployedDevices length is small which means deletion of that device
    //     if (
    //       existingDeviceIndex !== -1 &&
    //       alreadyDeployedDevices[0].deployedDevices.length > devices
    //     )
    //     {

    //     }
    //     // update
    //     else if (
    //       existingDeviceIndex !== -1 &&
    //       alreadyDeployedDevices[0].deployedDevices.length === devices
    //     ) {
    //       return {
    //         ...device,
    //         startDate: startDate ? startDate : device.startDate,
    //         endDate: endDate ? endDate : device.endDate,
    //       };
    //     } else {
    //       // it's a new device , push the new device ID into devices array of the customer

    //       customer.devices = [...customer.devices, device.device];

    //       return {
    //         slot: device.slot,
    //         startDate: startDate ? startDate : device.startDate,
    //         endDate: endDate ? endDate : device.endDate,
    //       };
    //     }
    //   }
    // );

    res.json(alreadyDeployedDevices);
  } catch (error) {
    console.log(error);
    throw new Error(error.message ? error.message : "Internal server error");
  }
});
