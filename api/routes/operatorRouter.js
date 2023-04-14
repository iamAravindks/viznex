import { Router } from "express";
import {
  addTheAdToQueue,
  loadProfile,
  operatorLogin,
} from "../controllers/operatorController.js";
import { fetchDevices } from "../controllers/deviceController.js";
import { isAuthOperator } from "../middlewares/middlewares.js";
import { logout } from "../controllers/otherController.js";

const operatorRouter = Router();

// @desc Operator login
// @route POST /api/operator/login
// @access Private

operatorRouter.post("/login", operatorLogin);

// @desc create queue by adding the ads to devices
// @route POST /api/operator/create-queue
// @access Private

operatorRouter.post("/create-queue", isAuthOperator, addTheAdToQueue);

// @desc fetch all the devices
// @route GET /api/operator/load-devices
// @access Private

operatorRouter.get("/load-devices", isAuthOperator, fetchDevices);

// @desc Fetch the Profile
// @route Get /api/operator/profile
// @access Private
operatorRouter.get("/profile", isAuthOperator, loadProfile);


// @desc Logout
// @route DELETE /api/operator/logout
// @access Private
operatorRouter.delete(
  "/logout",
  logout("Viznx_Secure_Session_ID", "Viznx_operator_Status")
);
export default operatorRouter;
