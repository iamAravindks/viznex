import { Router } from "express";
import {
  createGroup,
  deleteGroupByID,
  getAllGroups,
  updateGroupId,
} from "../controllers/groupController.js";
import { isAuthOperator } from "../middlewares/middlewares.js";

const groupRouter = Router();

// @desc create a new group
// @route POST /api/group/create-new
// @access Private

groupRouter.post("/create-new", isAuthOperator, createGroup);

// @desc get all groups
// @route GET /api/group/load-groups
// @access access
groupRouter.get("/load-groups", isAuthOperator, getAllGroups);

// @desc update a group
// @route PATCH /api/group/update/:id
// @access Private

groupRouter.patch("/update/:id", isAuthOperator, updateGroupId);

// @desc Delete a group
// @route DELETE /api/group/delete-group/:id
// @access Private

groupRouter.delete("/delete-group/:id", isAuthOperator, deleteGroupByID);

export default groupRouter;
