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

    const { name = customer.name, email = customer.email } = req.body;

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
  operator,
  startDate,
  endDate
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
                startDate,
                endDate,
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

const removeAdDevices = async (slotsWithFrequencies, devices, ad, operator) => {
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
  } catch (error) {}
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
      operator,
      startDate,
      endDate
    );
    const uniqueArr = successFullUpdate.filter(
      (obj, index, self) => index === self.findIndex((o) => o._id === obj._id)
    );
    await removeAdDevices(slotsWithFrequencies, devices, ad, operator);
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
    let { name, ad, slots, customerEmail, url, startDate, endDate, devices } =
      req.body;
    const operator = await Operator.findById(req.operator._id);
    const customer = await Customer.findOne({
      customerEmail,
    });

    // first update the ad url , for that
    if (url || name) {
      const adObj = await Ad.findById(ad);
      url = req.body.url || adObj.url;
      name = req.body.name || adObj.name;
      const updateAd = await Ad.updateOne(
        {
          _id: ad,
        },
        {
          $set: {
            url,
            name,
          },
        }
      );
    }

    await operator.save();

    res.json(operator.toJSON());
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

export const loadAd = expressAsyncHandler(async (req, res) => {
  let {datereq} = req.body
  try {
    const adId = req.params.id;
    const operator = await Operator.findById(req.operator.id).populate({
      path: "adsUnderOperator.ad",
      populate: {
        path: "customer",
      },
    });

    const ad = operator.adsUnderOperator.id(adId);
    const groupedDevices = ad.deployedDevices.reduce((acc, curr) => {
      const deviceId = curr.device;
      if (!acc[deviceId]) {
        acc[deviceId] = [];
      }
      acc[deviceId].push(curr);
      return acc;
    }, {});

    // Finally, map the groupedDevices object to an array of objects
    const groupedSlots = Object.keys(groupedDevices).map((deviceId) => {
      return {
        deviceId: deviceId,
        slots: groupedDevices[deviceId],
      };
    });
    let result = [];
    groupedSlots.forEach((groupedSlot) => {
      let deviceFrequencies = {};
      groupedSlot.slots.forEach((slot) => {
        let frequency = slot.slot.frequency;
        let datesPlayed = slot.slot.datesPlayed;
        let timesPlayedOnDate = 0;
        datesPlayed.forEach((datePlayed) => {
          if (datePlayed.date === datereq) {
            timesPlayedOnDate = datePlayed.nooftimesplayed;
          }
        });
        deviceFrequencies[slot.slot.slotType] = {
          frequency,
          timesPlayedOnDate,
        };
      });
      result.push({
        deviceid: groupedSlot.deviceid,
        frequencies: deviceFrequencies,
      });
    });

    const frequenciesArray = result.map(item => {
      const { frequencies } = item;
      return Object.values(frequencies).map(slot => slot.frequency);
    });
    const timesPlayedOnDateArray = [];

    result.forEach(item => {
      const { frequencies } = item;
      const timesPlayedOnDateForDevice = Object.values(frequencies).map(slot => slot.timesPlayedOnDate);
      timesPlayedOnDateArray.push(timesPlayedOnDateForDevice);
    });



    // Send the response with the ad object and the grouped slots
    res.send({ ad: ad, groupedSlots: groupedSlots , result:result, frequency:frequenciesArray,timesPlayedOnDateArray:timesPlayedOnDateArray });
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

export const incPlayed = expressAsyncHandler(async (req, res) => {
  const { operatorId, adId, deviceId, slotType } = req.body;
  const operator = await Operator.findById(operatorId);
  // find the ad object with the given ID
  const adObject = operator.adsUnderOperator.find(
    (ad) => ad.ad._id.toString() === adId
  );

  // find the deployed device object for the given device ID and slot type
  const deployedDevice = adObject.deployedDevices.find(
    (device) =>
      device.device.toString() === deviceId && device.slot.slotType === slotType
  );

  // find the play count of the deployed device for the given slot type

  const date = new Date().toISOString();

  return res.status(200).json(deployedDevice.slot.noOfTimesPlayed);
});

export const getIncPlayed = expressAsyncHandler(async (req, res) => {
  const { operatorId, adId, deviceId, slotType } = req.body;
  const operator = await Operator.findById(operatorId);
  // find the ad object with the given ID
  const adObject = operator.adsUnderOperator.find(
    (ad) => ad.ad._id.toString() === adId
  );

  // find the deployed device object for the given device ID and slot type
  const deployedDevice = adObject.deployedDevices.find(
    (device) =>
      device.device.toString() === deviceId && device.slot.slotType === slotType
  );

  const playCount = deployedDevice.slot.noOfTimesPlayed;
  res.status(200).json({ success: true, playCount });
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
    const operator = await Operator.findById(req.params.id).populate({
      path: "adsUnderOperator.ad",
    });

    if (!operator) {
      res.status(404);
      throw new Error("No operator found,try again");
    }

    res.status(200).json(operator.toJSON());
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

// get the report of an ad from all of the operators
export const getAdHistory = expressAsyncHandler(async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const adInfo = await Operator.aggregate([
      {
        $project: {
          _id: 0,
          name: 1,
          email: 1,
          adsUnderOperator: {
            $filter: {
              input: "$adsUnderOperator",
              as: "ads",
              cond: {
                $eq: ["$$ads.ad", new mongoose.Types.ObjectId(req.params.id)],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "devices",
          localField: "adsUnderOperator.deployedDevices.device",
          foreignField: "_id",
          as: "devices",
        },
      },
    ]);

    console.log(adInfo);
    let adHistory = adInfo.map((item) => {
      if (!item.adsUnderOperator || !item.devices) {
        delete item.devices;
        return item;
      } else {
        const devices = item.devices;
        const obj = {
          name: item.name,
          email: item.email,
          adsUnderOperator: item.adsUnderOperator.map((adObj) => {
            return {
              ad: adObj.ad,
              deployedDevices: adObj.deployedDevices.map((deviceObj) => {
                const deviceInd = devices.findIndex((d) =>
                  d._id.equals(deviceObj.device)
                );
                return {
                  ...deviceObj,
                  device: {
                    name: devices[deviceInd].name,
                    location: devices[deviceInd].location,
                    deviceId: devices[deviceInd].deviceId,
                    _id: devices[deviceInd]._id,
                  },
                };
              }),
            };
          }),
        };
        return obj;
      }
    });

    adHistory = adHistory
      .filter(
        (item) => item.adsUnderOperator && item.adsUnderOperator.length > 0
      )
      .reduce((acc, curr) => {
        acc = curr;
      });

    adHistory.adsUnderOperator.forEach((adObj) =>
      adObj.deployedDevices.forEach((item) => {
        item.slot.datesPlayed = item.slot.datesPlayed.filter(
          (data) =>
            data.date >= new Date(startDate) && data.date <= new Date(endDate)
        );
      })
    );

    adHistory.adsUnderOperator[0].deployedDevices =
      adHistory.adsUnderOperator[0].deployedDevices?.reduce((acc, curr) => {
        const deviceId = curr.device._id;
        if (!acc[deviceId]) {
          acc[deviceId] = [];
        }
        acc[deviceId].push(curr);
        return acc;
      }, {});

    const groupedSlots = Object.keys(
      adHistory.adsUnderOperator[0].deployedDevices
    ).map((id) => {
      // console.log(adHistory.adsUnderOperator[0].deployedDevices[id][0].device);
      return {
        device: adHistory.adsUnderOperator[0].deployedDevices[id][0].device,
        slots: adHistory.adsUnderOperator[0].deployedDevices[id],
      };
    });

    adHistory.groupedSlots = groupedSlots;
    delete adHistory.adsUnderOperator;

    adHistory.groupedSlots.forEach((item) => {
      item.slots.forEach((sObj) => {
        delete sObj.device;
      });
    });

    res.json(adHistory);
  } catch (error) {
    console.log(error);
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

export const incNoTimesPlayed = expressAsyncHandler(async (req, res) => {
  try {
    const { operatorId, deviceId, slot, adId } = req.body;

    const operator = await Operator.findById(operatorId);
    if (!operator) {
      throw new Error("Operator not found");
    }

    const adObjInd = operator.adsUnderOperator.findIndex(
      (item) => item.ad.toString() === adId.toString()
    );

    if (adObjInd === -1) {
      throw new Error("Ad not found");
    }

    const deviceObjId = operator.adsUnderOperator[
      adObjInd
    ].deployedDevices.findIndex(
      (item) =>
        item.device.toString() === deviceId.toString() &&
        item.slot.slotType === slot
    );

    if (deviceObjId === -1) {
      throw new Error("Device not found");
    }

    const existsDateObj = operator.adsUnderOperator[adObjInd].deployedDevices[
      deviceObjId
    ].slot.datesPlayed.findIndex(
      (item) => item.date.getTime() === new Date().getTime()
    );

    if (existsDateObj !== -1) {
      operator.adsUnderOperator[adObjInd].deployedDevices[
        deviceObjId
      ].slot.datesPlayed[existsDateObj].noOfTimesPlayedOnDate += 1;
    } else {
      operator.adsUnderOperator[adObjInd].deployedDevices[
        deviceObjId
      ].slot.datesPlayed.push({
        date: new Date(),
        noOfTimesPlayedOnDate: 1,
      });
    }

    await operator.save();

    const updatedOperator = await Operator.findById(operatorId);
    if (!updatedOperator) {
      throw new Error("Updated operator not found");
    }

    res.json(updatedOperator);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});
