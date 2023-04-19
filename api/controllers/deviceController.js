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
        maxAge: maxAge,
        domain: 'viznx.in',
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      });
      res.cookie("Viznx_device_Status", device._id, {
        maxAge: maxAge,
        domain: 'viznx.in',
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none'
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
    const devices = await Device.find({}).select("deviceId name location slots").populate({
      path:"slots.queue.ad",
      populate: {
        path:"customer operator"
      }
    })
    res.status(200).json(devices);
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server Error");
  }
});

// @desc Get Profile of the device
// @access Private

export const loadProfile = expressAsyncHandler(async (req, res) => {
  try {
    const deviceInfo = await Device.findById(req.device.id)
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
    throw new Error(error.message ? error.message : "Internal server error");
  }
});
