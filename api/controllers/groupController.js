// @desc create a new Group

import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { Group } from "../models/GroupModel.js";

export const createGroup = expressAsyncHandler(async (req, res) => {
  try {
    const { devices, name } = req.body;

    if (!name || !devices || devices.length <= 0) {
      res.status(400);
      throw new Error("devices and name are required ");
    }

    const isNotValid = devices.some((dev) => !mongoose.isValidObjectId(dev));

    if (isNotValid) {
      res.status(400);
      throw new Error("invalidity in devices ");
    }

    const operator = req.operator._id;

    const newGroup = await Group.create({
      name,
      operator,
      devices,
    });

    if (!newGroup) {
      throw new Error("error in creating new group");
    }

    const allGroups = await Group.find({
      operator,
    })
      .populate({
        path: "devices",
        select: "deviceId name location",
      })
      .select("-operator");

    res.status(200).json(allGroups);
  } catch (error) {
    console.log(error);
    throw new Error(error.message ? error.message : "Internal server");
  }
});

export const getAllGroups = expressAsyncHandler(async (req, res) => {
  try {
    const operator = req.operator._id;
    const allGroups = await Group.find({
      operator,
    })
      .populate({
        path: "devices",
        select: "deviceId name location",
      })
      .select("-operator");
    res.status(200).json(allGroups);
  } catch (error) {
    console.log(error);
    throw new Error(error.message ? error.message : "Internal server");
  }
});
