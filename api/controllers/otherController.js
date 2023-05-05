import expressAsyncHandler from "express-async-handler";
import { Group } from "../models/GroupModel.js";
import mongoose from "mongoose";
import Device from "../models/DeviceModel.js";

export const logout = (cookieName, otherCookie = null) =>
  expressAsyncHandler(async (req, res) => {
    try {
      res.clearCookie(cookieName);
      if (otherCookie) res.clearCookie(otherCookie);
      res.status(200).json({
        message: "Successfully logged out",
      });
    } catch (error) {
      throw new Error(error?.message || "Internal server error");
    }
  });

export const allGroupsByOperator = async (operator) => {
  const allGroups = await Group.find({
    operator,
  })
    .populate({
      path: "devices",
      select: "deviceId name location",
    })
    .select("-operator");
  return allGroups;
};

export const getDeviceFullProfile = async (deviceId) => {
  const deviceInfo = await Device.findById(
    new mongoose.Types.ObjectId(deviceId)
  )
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
      select: "name email adsUnderOperator",
    })
    .lean();

  deviceInfo.slots.forEach((slotObj) => {
    if (slotObj.queue.length > 0) {
      slotObj.queue.forEach((qObj) => {
        const adId = qObj.ad._id.toString();
        const datesPlayed = [];
        qObj.operator.adsUnderOperator.forEach((adObj) => {
          if (adId === adObj.ad.toString()) {
            datesPlayed.push(
              adObj.deployedDevices.find(
                (dsObj) =>
                  dsObj.slot.slotType === slotObj.name &&
                  dsObj.device.toString() === deviceId.toString()
              )?.slot.datesPlayed
            );
          }
        });
        qObj.datesPlayed = datesPlayed.flatMap((subArr) => subArr);
      });
    }
  });

  deviceInfo.slots.forEach((slotObj) => {
    if (slotObj.queue.length > 0) {
      slotObj.queue.forEach((qObj) => {
        delete qObj.operator.adsUnderOperator;
      });
    }
  });

  return deviceInfo;
};
