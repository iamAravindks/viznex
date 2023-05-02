import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Admin from "../models/adminModel.js";
import Device from "../models/DeviceModel.js";
import Operator from "../models/OperatorModel.js";
import Customer from "../models/customerSchema.js";
import generateToken from "../utils/utils.js";

// @desc Register a admin , NB:There is only one admin user here
// @access Private
export const adminSignUp = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(200).json({
      message: "Admin fields are required",
    });
  }

  try {
    const adminData = await Admin.countDocuments({});
    console.log(adminData);
    if (adminData > 0) {
      res.status(400);
      throw new Error("There is already an admin");
    }
    const admin = await Admin.create({
      name,
      email,
      password,
    });
    if (admin) {
      const maxAge = 3 * 24 * 60 * 60;
      const token = generateToken(admin._id);
      res.cookie("Viznx_Secure_Session_ID", token, {
        maxAge: maxAge * 1000,
        domain: ".viznx.in",
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.cookie("Viznx_admin_Status", admin._id, {
        maxAge: maxAge * 1000,
        domain: ".viznx.in",
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      });
    } else {
      res.status(400);
      throw new Error("Admin already exists");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc Admin  login
// @access Private

export const adminLogin = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(200).json({
      message: "Admin fields are required",
    });
  }

  try {
    const admin = await Admin.findOne({ email, name });

    if (admin && (await admin.matchPassword(password))) {
      const maxAge = 3 * 24 * 60 * 60;
      const token = generateToken(admin._id);
      res.cookie("Viznx_Secure_Session_ID", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      });
      res.cookie("Viznx_admin_Status", admin._id, {
        maxAge: maxAge * 1000,
        httpOnly: true,
      });
      res.status(201).json(admin.toJSON());
    } else {
      res.status(401);
      throw new Error("invalid password or email");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc create operator
// @access private

export const createOperator = expressAsyncHandler(async (req, res) => {
  const { name, email, password, location } = req.body;

  if (!name || !email || !password || !location) {
    return res.status(200).json({
      message: "Operator fields are required",
    });
  }

  try {
    const operatorExists = await Operator.findOne({ email });

    if (operatorExists) {
      res.status(409);
      throw new Error("Operator already exists");
    }

    const operator = await Operator.create({
      name,
      email,
      password,
      location,
    });

    if (operator) {
      res.status(201).json({
        message: "Operator creation success",
      });
    }
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});

// @desc create a device
// @access Private

export const createDevice = expressAsyncHandler(async (req, res) => {
  const { deviceId, name, password, location } = req.body;

  if (!deviceId || !name || !password || !location) {
    return res.status(200).json({
      message: "Device fields are required",
    });
  }

  try {
    const deviceExists = await Device.findOne({ deviceId, name });

    if (deviceExists) {
      res.status(409);
      throw new Error("Device already exists");
    }

    const device = await Device.create({ deviceId, name, password, location });

    if (device) {
      res.status(201).json({
        message: "Device creation success",
      });
    }
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});

export const loadProfile = expressAsyncHandler(async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (admin) {
      return res.status(200).json(admin.toJSON());
    } else {
      res.status(400);
      throw new Error("Bad request");
    }
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});

// @desc Update a device
// @access Private

export const updateDevice = expressAsyncHandler(async (req, res) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.params.id);
    console.log(req.params.id);
    const device = await Device.findById(_id);

    if (!device) {
      res.status(404);
      throw new Error("Device not found");
    }

    const {
      name = device.name,
      location = device.location,
      deviceId = device.deviceId,
    } = req.body;

    const result = await Device.updateOne(
      {
        _id,
      },
      {
        name,
        location,
        deviceId,
      }
    );

    if (result.nModified === 0) {
      res.status(500);
      throw new Error("Device not updated");
    }
    const devices = await Device.find({}).select("-password");

    res.status(200).json(devices);
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});

// @desc Delete a device
// @access Private

export const deleteDeviceId = expressAsyncHandler(async (req, res) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.params.id);
    console.log(req.params.id);
    const device = await Device.findById(_id);

    if (!device) {
      res.status(404);
      throw new Error("Device not found");
    }

    const result = await Device.deleteOne({
      _id,
    });

    if (result.deletedCount === 0) {
      res.status(500);
      throw new Error("Device not deleted");
    }
    const devices = await Device.find({}).select("-password");

    res.status(200).json(devices);
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});

// @desc Edit a operator by id
// @route PATCH /api/admin/edit-operator/;id
// @access Private

export const editOperatorId = expressAsyncHandler(async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400);
      throw new Error("Oops! Bad request ");
    }
    const operator = await Operator.findById(req.params.id);
    if (!operator) {
      res.status(404);
      throw new Error("No operator found,check again");
    }
    const {
      name = operator.name,
      email = operator.email,
      location = operator.location,
    } = req.body;
    console.log(name);
    operator.name = name;
    operator.email = email;
    operator.location = location;

    if (req.body.password) {
      operator.password = req.body.password;
    }
    await operator.save();

    const operators = await Operator.find({}).select("name email location");
    return res.status(200).json(operators);
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});

// @desc Delete a operator by id
// @access Private

export const deleteOperatorId = expressAsyncHandler(async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400);
      throw new Error("Oops! Bad request ");
    }
    const operator = await Operator.findById(req.params.id);
    if (!operator) {
      res.status(404);
      throw new Error("No operator found,check again");
    }
    const deleteOperator = await Operator.deleteOne({
      _id: req.params.id,
    });

    if (deleteOperator.deletedCount === 0) {
      res.status(500);
      throw new Error("Device not deleted");
    }

    const operators = await Operator.find({}).select("name email location");
    return res.status(200).json(operators);
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});

// @desc Edit a customer by id
// @route PATCH /api/admin/edit-customer/:id
// @access Private

export const editCustomerId = expressAsyncHandler(async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400);
      throw new Error("Oops! Bad request ");
    }
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      res.status(404);
      throw new Error("No customer found,check again");
    }
    const { name = customer.name, email = customer.email } = req.body;

    customer.name = name;
    customer.email = email;

    if (req.body.password) {
      customer.password = req.body.password;
    }
    await customer.save();

    const customers = await Customer.find({}).select("name email location");
    return res.status(200).json(customers);
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});

// @desc Delete a customer by id
// @access Private

export const deleteCustomerId = expressAsyncHandler(async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400);
      throw new Error("Oops! Bad request ");
    }
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      res.status(404);
      throw new Error("No customer found,check again");
    }
    const deleteCustomer = await Customer.deleteOne({
      _id: req.params.id,
    });

    if (deleteCustomer.deletedCount === 0) {
      res.status(500);
      throw new Error("Device not deleted");
    }

    const customers = await Customer.find({}).select("name email location");
    return res.status(200).json(customers);
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});



export const getAdminAdHistory = expressAsyncHandler(async (req, res) => {
  try {
    const { adId, opId, startDate, endDate } = req.body;
    /* const adInfo = await Operator.aggregate([
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
    }); */

    const operator = await Operator.findById(opId).populate({
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
    const groupedSlots = await Promise.all(
      Object.keys(groupedDevices).map(async (deviceId) => {
        const device = await Device.findById(deviceId).exec();
        return {
          device: device.toJSON(),
          deviceId: deviceId,
          slots: groupedDevices[deviceId],
        };
      })
    );
    let totalSum = 0;
    for (let i = 0; i < groupedSlots.length; i++) {
      let slotobj = groupedSlots[i];
      let frequencySum = 0;
      let start = new Date(startDate);
      let end = new Date(endDate);
      let numDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

      for (let j = 0; j < slotobj.slots.length; j++) {
        let frequency = slotobj.slots[j].slot.frequency;
        frequencySum = frequencySum + frequency * numDays;
      }

      let slotSum = frequencySum;
      totalSum += slotSum;
      groupedSlots[i].sheduledFrequency = totalSum;
    }
    let totalSumPlayed = 0;
    for (let i = 0; i < groupedSlots.length; i++) {
      let groupedSlot = groupedSlots[i];
      let sum = 0;
      for (let j = 0; j < groupedSlot.slots.length; j++) {
        let slot = groupedSlot.slots[j];
        let datesPlayed = slot.slot.datesPlayed;
        for (let k = 0; k < datesPlayed.length; k++) {
          sum += parseInt(datesPlayed[k].noOfTimesPlayedOnDate);
        }
      }
      groupedSlots[i].totalSumPlayed = sum;
    }

    console.log(totalSum);

    res.json({ adId, operator, ad, groupedSlots });
  } catch (error) {
    console.log(error);
    throw new Error(error.message ? error.message : "Internal server error");
  }
});