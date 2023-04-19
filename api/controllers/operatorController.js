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
      res.cookie("Viznx_Secure_Operator_Session_ID", token, {
        maxAge: maxAge * 1000,
        // domain: "viznx.in",
        path: "/",
        httpOnly: true,
        // secure: true,
        // sameSite: "none",
      });
      res.cookie("Viznx_operator_Status", operator._id, {
        maxAge: maxAge * 1000,
        // domain: "viznx.in",
        path: "/",
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
    const operators = await Operator.find({});
    res.status(200).json(operators);
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});
export const fetchCustomers = expressAsyncHandler(async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.status(200).json(customers);
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

export const updateCustomer = expressAsyncHandler(async (req, res) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.params.id);
    console.log(req.params.id);
    const customer = await Customer.findById(_id);

    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }

    const {
      name = customer.name,
      email = customer.email,
    } = req.body;

    const result = await Customer.updateOne(
      {
        _id,
      },
      {
        name,
        email,
      }
    );

    if (result.nModified === 0) {
      res.status(500);
      throw new Error("Customer not updated");
    }

    res.status(200).json(customer);
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});




export const deleteCustomer = expressAsyncHandler(async (req, res) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.params.id);
    console.log(req.params.id);
    const customer = await Customer.findById(_id);

    if (!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }

    const result = await Customer.deleteOne({
      _id,
    });

    if (result.deletedCount === 0) {
      res.status(500);
      throw new Error("customer not deleted");
    }

    res.status(200).json(customer);
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});


// @desc Get Profile of the operator
// @access Private

export const loadProfile = expressAsyncHandler(async (req, res) => {
  try {
    const operator = await Operator.findById(req.operator.id).populate({
      path: "adsUnderOperator.ad",
      populate: {
        path: "customer",
        select: "name email",
      },
    });
    res.status(200).json(operator.toJSON());
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

// @desc Add an ad
// @access Private

const addToDevices = async (
  slotsWithFrequencies = [],
  devices,
  ad,
  operator
) => {
  try {
    const rawData = devices
      .map((device) => {
        return slotsWithFrequencies.map((item) => {
          return {
            device,
            slot: item.slot,
            adFrequency: item.adFrequency,
          };
        });
      })
      .flat();
    const updatePromises = rawData.map(async (data) => {
      // check whether the ad is also present in the device
      const device = await Device.findOne({
        _id: new mongoose.Types.ObjectId(data.device),
        slots: {
          $elemMatch: {
            name: data.slot,
            "queue.ad": ad._id,
            "queue.operator": operator._id,
          },
        },
      });

      if (device) {
        const _id = data.device;
        return { _id }; // skip adding the device if it already exists in the array
      } else {
        const updateResult = await Device.updateOne(
          {
            _id: new mongoose.Types.ObjectId(data.device),
            slots: {
              $elemMatch: {
                name: data.slot,
              },
            },
          },
          {
            $addToSet: {
              "slots.$.queue": {
                ad: ad._id,
                adFrequency: data.adFrequency,
                operator: operator._id,
              },
            },
          }
        );

        console.log(`${updateResult.nModified} documents updated`);

        if (updateResult.nModified === 0) {
          throw new DeviceNotFound(`Device ${data.device} not found`);
        } else {
          const _id = data.device;
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
    slotsWithFrequencies,
  } = req.body;

  if (
    !name ||
    !customerEmail ||
    !url ||
    !devices ||
    !startDate ||
    !endDate ||
    !slotsWithFrequencies
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
      slotsWithFrequencies,
      devices,
      ad,
      operator
    );
    const uniqueArr = successFullUpdate.filter(
      (obj, index, self) => index === self.findIndex((o) => o._id === obj._id)
    );

    if (
      successFullUpdate.length !==
        devices.length * slotsWithFrequencies.length ||
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
    const combinationDeployedDevices = devices
      .map((device) => {
        return slotsWithFrequencies.map((item) => {
          return {
            device,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            slot: { slotType: item.slot, frequency: item.adFrequency },
          };
        });
      })
      .flat();

    // for that create an array with combinations of both devices and slots

    // const combinationDeployedDevices = slots.flatMap((slot) =>
    //   devices.map((deviceId) => ({
    //     device: new mongoose.Types.ObjectId(deviceId),
    //     startDate: new Date(startDate),
    //     endDate: new Date(endDate),
    //     slot: {
    //       slotType: slot,
    //     }, // only include the slotType value as a string
    //   }))
    // );

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
            frequency: device.slot.frequency,
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
    const { ad, slots, customerEmail, url, startDate, endDate, devices } =
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

    // add devices to the customer
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

    // set up the devices queue according to the session , duplication is avoided , expected new devices that
    // is either updated or removed
    // TODO : we need another method to remove the ad from old devices after all process

    const successFullUpdate = await addToDevices(
      slots,
      devices,
      ad,
      operator,
      adFrequency
    );

    if (
      successFullUpdate.length !== devices.length ||
      !successFullUpdate.every((device) => devices.includes(device._id))
    ) {
      throw new Error("Error on device update with queue");
    }

    // next update the operator side

    // find the index of the object with ad

    const existingAdIndex = operator.adsUnderOperator.findIndex(
      (adObj) => adObj.ad.toString() === ad._id.toString()
    );
    const defaultStartDate =
      operator.adsUnderOperator[existingAdIndex].startDate;
    const defaultEndDate = operator.adsUnderOperator[existingAdIndex].endDate;

    // since it is editing , ad with an id is already present

    // for that create an array with combinations of both devices and slots
    // it has objects of devices with slots , we need to update the date also

    const combinationDeployedDevices = slots.flatMap((slot) =>
      devices.map((deviceId) => ({
        device: new mongoose.Types.ObjectId(deviceId),
        startDate: startDate ? startDate : defaultStartDate,
        endDate: endDate ? endDate : defaultEndDate,

        slot: {
          slotType: slot,
        }, // only include the slotType value as a string
      }))
    );

    // combinationDeployedDevices is the new deployedDevices of the object with ad ID

    // find the object with ad , iterate over the deployedDevices ,
    //TODO: if already a device is present update only the startDate and endDate else copy the new device

    operator.save();
  } catch (error) {
    console.log(error);
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

// @desc Load ads from operator
// @access Private
export const loadAds = expressAsyncHandler(async (req, res) => {
  try {
    const operator = await Operator.findById(req.operator.id)
      .populate({
        path: "adsUnderOperator.ad",
        select: "_id name url operator customer",
        populate: {
          path: "customer",
          select: "name email",
        },
      })
      .populate({
        path: "adsUnderOperator.deployedDevices.device",
        select: "_id name location",
      });
    if (operator) {
      return res.status(200).json(operator?.adsUnderOperator);
    } else {
      throw new Error("Please try again");
    }
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

// @desc Load devices from operator
// @access Private

export const loadDevices = expressAsyncHandler(async (req, res) => {
  try {
    const devices = await Operator.aggregate([
      {
        $match: {
          _id: req.operator._id,
        },
      },
      {
        $unwind: "$adsUnderOperator",
      },
      { $unwind: "$adsUnderOperator.deployedDevices" },
      {
        $lookup: {
          from: "devices",
          localField: "adsUnderOperator.deployedDevices.device",
          foreignField: "_id",
          as: "device",
        },
      },
      { $unwind: "$device" },
      {
        $project: {
          _id: "$device._id",
          deviceId: "$device.deviceId",
          name: "$device.name",
          location: "$device.location",
          slots: "$device.slots",
        },
      },
      {
        $group: {
          _id: "$_id",
          deviceId: { $first: "$deviceId" },
          name: { $first: "$name" },
          location: { $first: "$location" },
          slots: { $first: "$slots" },
        },
      },
      { $unwind: "$slots" },
      {
        $lookup: {
          from: "ads",
          localField: "slots.queue.ad",
          foreignField: "_id",
          as: "slots.queue.ad",
        },
      },
      {
        $group: {
          _id: "$_id",
          deviceId: { $first: "$deviceId" },
          name: { $first: "$name" },
          location: { $first: "$location" },
          slots: { $push: "$slots" },
        },
      },
    ]);
    res.json(devices);
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

// @desc Get the data of a operator by id
// @access Private

export const getOperatorById = expressAsyncHandler(async (req, res) => {
  try {
    const operator = await Operator.findById(req.params.id).populate({path:"adsUnderOperator.ad"})
    
    if (!operator) {
      res.status(404);
      throw new Error("No operator found,try again");
    }

    res.status(200).json(operator.toJSON());
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});
