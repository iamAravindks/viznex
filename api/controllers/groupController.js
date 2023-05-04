// @desc create a new Group

import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { Group } from "../models/GroupModel.js";
import { allGroupsByOperator } from "./otherController.js";

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

    const allGroups = await allGroupsByOperator(operator);

    res.status(200).json(allGroups);
  } catch (error) {
    console.log(error);
    throw new Error(error.message ? error.message : "Internal server");
  }
});

// @desc get all groups

export const getAllGroups = expressAsyncHandler(async (req, res) => {
  try {
    const operator = req.operator._id;
    const allGroups = await allGroupsByOperator(operator);
    res.status(200).json(allGroups);
  } catch (error) {
    console.log(error);
    throw new Error(error.message ? error.message : "Internal server");
  }
});

// @desc update a group by and id

export const updateGroupId = expressAsyncHandler(async (req, res) => {
  try {
    const _id = req.params.id;

    if (!mongoose.isValidObjectId(_id)) {
      res.status(400);
      throw new Error("Invalid group id");
    }
    const { devices } = req.body;

    const isNotValid = devices?.some((dev) => !mongoose.isValidObjectId(dev));

    if (devices && isNotValid) {
      res.status(400);
      throw new Error("invalidity in devices ");
    }

    const group = await Group.findById(new mongoose.Types.ObjectId(_id));

    if (!group) {
      res.status(400);
      throw new Error("No group found");
    }
    const { name = group.name } = req.body;

    const operator = req.operator._id;

    const updatedGroup = await Group.updateOne(
      {
        _id: new mongoose.Types.ObjectId(_id),
        operator: operator._id,
      },
      {
        $set: { name, devices },
      }
    );

    if (updatedGroup.nModified === 0) {
      throw new Error("Error in updating group");
    }

    const allGroups = await allGroupsByOperator(operator);

    res.status(200).json(allGroups);
  } catch (error) {
    console.log(error);
    throw new Error(error.message ? error.message : "Internal server");
  }
});

//  @desc delete a group by id

export const deleteGroupByID = expressAsyncHandler(async (req, res) => {
  try {
    const _id = req.params.id;

    if (!mongoose.isValidObjectId(_id)) {
      res.status(400);
      throw new Error("Invalid group id");
    }

    const operator = req.operator._id;

    const result = await Group.deleteOne({
      _id: new mongoose.Types.ObjectId(_id),
      operator,
    });
    if (result.deletedCount !== 1) {
      throw new Error("error in deletion");
    }

    const allGroups = await allGroupsByOperator(operator);

    res.status(200).json(allGroups);
  } catch (error) {
    console.log(error);
    throw new Error(error.message ? error.message : "Internal server");
  }
});
