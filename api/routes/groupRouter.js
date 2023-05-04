import { Router } from "express";
import { createGroup, getAllGroups } from "../controllers/groupController.js";
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

export default groupRouter;
