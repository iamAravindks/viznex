import expressAsyncHandler from "express-async-handler";
import { Group } from "../models/GroupModel.js";

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
