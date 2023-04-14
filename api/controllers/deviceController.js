import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Device from "../models/DeviceModel.js";
import { generateTokenForDevice } from "../utils/utils.js";
import Ad from "../models/AdModel.js";

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
        httpOnly: true,
        maxAge: maxAge,
        sameSite: "None",
        path: "/",
        secure: true,
      });
      res.cookie("Viznx_device_Status", device._id, {
        maxAge: maxAge,
        sameSite: "None",
        path: "/",
        secure: true,
      });

      // const deviceInfo = await Device.findById(device._id)
      //   .populate("morningQueue.ad", "name url customer")
      //   .populate("noonQueue.ad", "name url customer")
      //   .populate("eveningQueue.ad", "name url customer")
      //   .populate("morningQueue.operator", "name email")
      //   .populate("noonQueue.operator", "name email")
      //   .populate("eveningQueue.operator", "name email");

      const deviceInfo = await Device.findOne({ deviceId })
        .select("-password ")
        .populate({
          path: "slots",
          select: "name ",
          populate: {
            path: "queue.ad",
            select: "name url customer",
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
    const device = await Device.findById(req.device.id)
      .populate("morningQueue.ad", "name url customer")
      .populate("noonQueue.ad", "name url customer")
      .populate("eveningQueue.ad", "name url customer")
      .populate("morningQueue.operator", "name email")
      .populate("noonQueue.operator", "name email")
      .populate("eveningQueue.operator", "name email");

    const morningQueueAds = await Promise.all(
      device.morningQueue.map(async (queue) => {
        const ad = await Ad.findById(queue.ad._id).populate(
          "customer",
          "name email"
        );
        return {
          name: ad.name,
          url: ad.url,
          customer: {
            name: ad.customer.name,
            email: ad.customer.email,
          },
          operator: {
            name: queue.operator.name,
            email: queue.operator.email,
          },
        };
      })
    );

    const noonQueueAds = await Promise.all(
      device.noonQueue.map(async (queue) => {
        const ad = await Ad.findById(queue.ad._id).populate(
          "customer",
          "name email"
        );
        return {
          name: ad.name,
          url: ad.url,
          customer: {
            name: ad.customer.name,
            email: ad.customer.email,
          },
          operator: {
            name: queue.operator.name,
            email: queue.operator.email,
          },
        };
      })
    );

    const eveningQueueAds = await Promise.all(
      device.eveningQueue.map(async (queue) => {
        const ad = await Ad.findById(queue.ad._id).populate(
          "customer",
          "name email"
        );
        return {
          name: ad.name,
          url: ad.url,
          customer: {
            name: ad.customer.name,
            email: ad.customer.email,
          },
          operator: {
            name: queue.operator.name,
            email: queue.operator.email,
          },
        };
      })
    );

    const queues = {
      morningQueue: {
        ads: morningQueueAds,
      },
      noonQueue: {
        ads: noonQueueAds,
      },
      eveningQueue: {
        ads: eveningQueueAds,
      },
    };

    res.status(200).json({ queues });
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error ");
  }
});

// @desc Load all the devices
// @access Private

export const fetchDevices = expressAsyncHandler(async (req, res) => {
  try {
    const devices = await Device.find({}).select("deviceId name location ");
    res.status(200).json(devices);
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server Error");
  }
});

// @desc Get Profile of the device
// @access Private

export const loadProfile = expressAsyncHandler(async (req, res) => {
  try {
    const device = await Device.findById(req.device.id);

    const deviceInfo = await Device.findById(device._id)
      .populate("morningQueue.ad", "name url customer")
      .populate("noonQueue.ad", "name url customer")
      .populate("eveningQueue.ad", "name url customer")
      .populate("morningQueue.operator", "name email")
      .populate("noonQueue.operator", "name email")
      .populate("eveningQueue.operator", "name email");

    const morningQueueAds = await Promise.all(
      deviceInfo.morningQueue.map(async (queue) => {
        const ad = await Ad.findById(queue.ad._id).populate(
          "customer",
          "name email"
        );
        return {
          name: ad.name,
          url: ad.url,
          customer: {
            name: ad.customer.name,
            email: ad.customer.email,
          },
          operator: {
            name: queue.operator.name,
            email: queue.operator.email,
          },
        };
      })
    );

    const noonQueueAds = await Promise.all(
      deviceInfo.noonQueue.map(async (queue) => {
        const ad = await Ad.findById(queue.ad._id).populate(
          "customer",
          "name email"
        );
        return {
          name: ad.name,
          url: ad.url,
          customer: {
            name: ad.customer.name,
            email: ad.customer.email,
          },
          operator: {
            name: queue.operator.name,
            email: queue.operator.email,
          },
        };
      })
    );

    const eveningQueueAds = await Promise.all(
      deviceInfo.eveningQueue.map(async (queue) => {
        const ad = await Ad.findById(queue.ad._id).populate(
          "customer",
          "name email"
        );
        return {
          name: ad.name,
          url: ad.url,
          customer: {
            name: ad.customer.name,
            email: ad.customer.email,
          },
          operator: {
            name: queue.operator.name,
            email: queue.operator.email,
          },
        };
      })
    );

    const queues = {
      morningQueue: {
        ads: morningQueueAds,
      },
      noonQueue: {
        ads: noonQueueAds,
      },
      eveningQueue: {
        ads: eveningQueueAds,
      },
    };

    const data = { ...device.toJSON(), queues };

    delete data.morningQueue;
    delete data.noonQueue;
    delete data.eveningQueue;

    return res.status(201).json(data);
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});
