import { Router } from "express";
import { createGroup, getAllGroups } from "../controllers/groupController.js";
import { isAuthOperator } from "../middlewares/middlewares.js";

const groupRouter = Router();

// @desc create a new group
// @route POST /api/group/create-new
// @access Private

groupRouter.post("/create-new", isAuthOperator, createGroup);
groupRouter.get("/load-groups", isAuthOperator, getAllGroups);

export default groupRouter;
