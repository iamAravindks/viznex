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

const addToDevices = async (slot, devices, ad, operator, adFrequency) => {
  // let sessionMong;
  // try {
  //   sessionMong = await mongoose.startSession();
  //   sessionMong.startTransaction();
  // } catch (error) {
  //   throw new Error(`Error starting transaction: ${error}`);
  // }

  try {
    const updatePromises = devices.map(async (_id) => {
      // check whether the ad is also present in the device
      const device = await Device.findOne({
        _id: new mongoose.Types.ObjectId(_id),
        slots: {
          $elemMatch: {
            name: slot,
            "queue.ad": ad._id,
            "queue.operator": operator._id,
          },
        },
      });

      console.log(device);
      if (device) {
        return { _id }; // skip adding the device if it already exists in the array
      } else {
        console.log("hello");
        const result = await Device.updateOne(
          {
            _id: new mongoose.Types.ObjectId(_id),
            slots: { $elemMatch: { name: slot } },
          },
          {
            $addToSet: {
              "slots.$.queue": {
                ad: ad._id,
                operator: operator._id,
                adFrequency: adFrequency,
              },
            },
          }
          // { session: sessionMong }
        );

        console.log(result);

        if (result.nModified === 0) {
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

// @desc Add an ad
// @access Private

export const addTheAdToQueue = expressAsyncHandler(async (req, res) => {
  const {
    name,
    customerEmail,
    url,
    devices,
    startDate,
    endDate,
    slot,
    adFrequency,
  } = req.body;

  if (
    !name ||
    !customerEmail ||
    !url ||
    !devices ||
    !startDate ||
    !endDate ||
    !slot ||
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
      slot,
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
    const existingAdIndex = operator.adsUnderOperator.findIndex(
      (adObj) => adObj.ad.toString() === ad._id.toString()
    );

    // if an ad with id present
    if (existingAdIndex !== -1) {
      const deployedDevices = devices.filter((deviceId) => {
        // check if the device is already present
        const existingDeviceIndex = operator.adsUnderOperator[
          existingAdIndex
        ].deployedDevices.findIndex(
          (deviceObj) => deviceObj.device.toString(),
          deviceId.toString()
        );
        // return false if it's already present, true otherwise
        return existingDeviceIndex === -1;
      });

      // add new devices to the existing ad
      operator.adsUnderOperator[existingAdIndex].deployedDevices.push(
        ...deployedDevices.map((deviceId) => ({
          device: new mongoose.Types.ObjectId(deviceId),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          slot: {
            slotType: slot,
          },
        }))
      );
    } else {
      // The ad does not exist, create a new ad object and push it to the adsUnderOperator array
      const deployedDevices = devices.map((deviceId) => {
        return {
          device: new mongoose.Types.ObjectId(deviceId),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          slot: {
            slotType: slot,
          },
        };
      });
      operator.adsUnderOperator.push({
        ad: ad._id,
        deployedDevices,
      });
    }

    await operator.save();

    res.status(200).json(operator.toJSON());
  } catch (error) {
    console.log(error);
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
