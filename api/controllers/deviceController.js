import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Device from "../models/DeviceModel.js";
import { generateTokenForDevice } from "../utils/utils.js";
import Ad from "../models/AdModel.js";
import { getDeviceFullProfile } from "./otherController.js";

// @desc Device Login
// @access Private

export const deviceLogin = expressAsyncHandler(async (req, res) => {
  const { deviceId, password } = req.body;

  if (!deviceId || !password) {
    return res.status(200).json({ message: "Device fields are required" });
  }

  try {
    const device = await Device.findOne({ deviceId });

    if (device && (await device.matchPassword(password))) {
      const maxAge = 1000 * 60 * 60 * 24 * 365 * 10; // set maxAge to 10 years
      const token = generateTokenForDevice(device._id);
      res.cookie("Viznx_Secure_Device_Session_ID", token, {
        maxAge: maxAge,
        // domain: "viznx.in",
        // path: "/",
        httpOnly: true,
        // secure: true,
        // sameSite: "none",
      });
      res.cookie("Viznx_device_Status", device._id, {
        maxAge: maxAge,
        // domain: "viznx.in",
        // path: "/",
        httpOnly: true,
        // secure: true,
        // sameSite: "none",
      });

      const deviceInfo = await Device.findOne({ deviceId })
        .select("-password ")
        .populate({
          path: "slots",
          select: "name ",
          populate: {
            path: "queue.ad",
            select: "name url adFrequency customer",
            populate: {
              path: "customer",
              select: "name email",
            },
          },
        })
        .populate({
          path: "slots.queue.operator",
          select: "name email",
        })
        .lean();

      return res.status(201).json(deviceInfo);
    } else {
      res.status(401);
      throw new Error("invalid password or email");
    }
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error ");
  }
});

// @desc Get all the queues with filled details
// @access Private

export const loadQueues = expressAsyncHandler(async (req, res) => {
  try {
    const deviceInfo = await Device.findById(req.device._id)
      .select("-password ")
      .populate({
        path: "slots",
        select: "name ",
        populate: {
          path: "queue.ad",
          select: "name url adFrequency customer",
          populate: {
            path: "customer",
            select: "name email",
          },
        },
      })
      .populate({
        path: "slots.queue.operator",
        select: "name email",
      })
      .lean();

    return res.status(201).json(deviceInfo);
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error ");
  }
});

// @desc Load all the devices
// @access Private

export const fetchDevices = expressAsyncHandler(async (req, res) => {
  try {
    const devices = await Device.find({})
      .select("deviceId name location slots")
      .populate({
        path: "slots.queue.ad",
        populate: [
          {
            path: "customer",
            select: "name email",
          },
          {
            path: "operator",
            select: "name email location",
          },
        ],
      });

    res.status(200).json(devices);
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server Error");
  }
});

// @desc Get Profile of the device
// @access Private

export const loadProfile = expressAsyncHandler(async (req, res) => {
  try {
    const deviceInfo = await getDeviceFullProfile(req.device.id);

    return res.status(201).json(deviceInfo);
  } catch (error) {
    console.log(error);
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

// @desc Get the data of a device by id
// @access Private

export const getDeviceById = expressAsyncHandler(async (req, res) => {
  try {
    const device = await Device.findById(req.params.id)
      .select("-password ")
      .populate({
        path: "slots",
        select: "name ",
        populate: {
          path: "queue.ad",
          select: "name url adFrequency customer startDate endDate",
          populate: {
            path: "customer",
            select: "name email",
          },
        },
      })
      .populate({
        path: "slots.queue.operator",
        select: "name email",
      })
      .lean();
    if (!device) {
      res.status(404);
      throw new Error("No device found,try again");
    }

    res.status(200).json(device);
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

export const getDeviceByIdDate = expressAsyncHandler(async (req, res) => {
  try {
    const { date } = req.body;
    const filterDate = new Date(date);

    const device = await Device.findById(req.params.id)
      .select("-password")
      .populate({
        path: "slots",
        select: "name",
        populate: {
          path: "queue.ad",
          select: "name url adFrequency customer startDate endDate",
          populate: {
            path: "customer",
            select: "name email",
          },
        },
      })
      .populate({
        path: "slots.queue.operator",
        select: "name email",
      });

    for (const slot of device.slots) {
      slot.queue = slot.queue.filter((adItem) => {
        return (
          new Date(adItem.startDate) <= filterDate &&
          new Date(adItem.endDate) >= filterDate
        );
      });
    }

    if (!device) {
      res.status(404);
      throw new Error("No device found,try again");
    }

    res.status(200).json(device);
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

export const getDeviceReport = expressAsyncHandler(async (req, res) => {
  try {
    const devices = await Device.findById(req.params.id)
      .select("deviceId name location slots")
      .populate({
        path: "slots.queue.ad",
        populate: [
          {
            path: "customer",
            select: "name email",
          },
          {
            path: "operator",
            select: "name email location adsUnderOperator",
          },
        ],
      });

    devices.slots.forEach((item) => {
      item.queue.forEach((qObj) => {
        qObj.operator.adsUnderOperator.forEach(
          (adObj) =>
            (adObj.deployedDevices =
              qObj.operator.adsUnderOperator.deployedDevices.filter(
                (deviceObj) =>
                  deviceObj.device.toString() === req.params.id.toString()
              ))
        );
      });
    });

    res.status(200).json(devices);
  } catch (error) {
    console.log(error);
    throw new Error(error.message ? error.message : "Internal server Error");
  }
});

export const getAdForecastReport = expressAsyncHandler(async (req, res) => {
  try {
    const { deviceId, to, from } = req.body;

    if (!deviceId || !mongoose.isValidObjectId(deviceId) || (!to && !from)) {
      res.status(400);
      throw new Error("Please provide correct date and device id");
    }
    const toDate = new Date(to);
    const fromDate = new Date(from);
    const deviceInfo = await Device.findById(
      new mongoose.Types.ObjectId(deviceId)
    )
      .select("-password")
      .populate({
        path: "slots",
        select: "name ",
        populate: {
          path: "queue.ad",
          select: "name url adFrequency customer",
          populate: {
            path: "customer",
            select: "name email",
          },
        },
      })
      .populate({
        path: "slots.queue.operator",
        select: "name email adsUnderOperator",
      })
      .lean();

    deviceInfo.slots.forEach((slotObj) => {
      if (slotObj.queue.length > 0) {
        slotObj.queue.forEach((qObj) => {
          delete qObj.operator.adsUnderOperator;
        });
      }
    });

    function getDatesInRange(fromDate, toDate) {
      const dates = [];
      let currentDate = new Date(fromDate);

      while (currentDate <= toDate) {
        dates.push(new Date(currentDate).toLocaleDateString());
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    }
    function createObjectWithKeys(keys) {
      const result = [];

      for (let i = 0; i < keys.length; i++) {
        result.push({ date: keys[i], data: [] });
      }

      return result;
    }

    const range = getDatesInRange(fromDate, toDate);

    const report = createObjectWithKeys(range);
    const copyDeviceInfo = { ...deviceInfo };

    report.forEach((elem) => {
      const date = elem.date;
      const dataForReport = copyDeviceInfo.slots.map((slotObj) => {
        const newSlotObj = { ...slotObj };
        if (newSlotObj.queue.length > 0) {
          newSlotObj.queue = newSlotObj.queue.filter(
            (adObj) =>
              // !confusion here
              new Date(adObj.startDate) <= new Date(date) &&
              new Date(date) <= new Date(adObj.endDate)
          );
        }
        return newSlotObj;
      });
      elem.data = dataForReport;
    });

    const { _id, name, deviceId: IdOfDevice, location } = deviceInfo;

    const response = {
      _id,
      name,
      deviceId: IdOfDevice,
      location,
      report,
    };

    res.json(response);
  } catch (error) {
    console.log(error);
    throw new Error(error.message ? error.message : "Internal server error");
  }
});
