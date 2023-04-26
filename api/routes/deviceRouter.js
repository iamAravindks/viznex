import { Router } from "express";
import {
  deviceLogin,
  getDeviceReport,
  loadProfile,
  loadQueues,
} from "../controllers/deviceController.js";
import { incPlayed } from "../controllers/operatorController.js";
import { logout } from "../controllers/otherController.js";
import { isAuthDevice } from "../middlewares/middlewares.js";

const deviceRouter = Router();

// @desc Device Login
// @route POST /api/device/login
// @access Private

deviceRouter.post("/login", deviceLogin);

// @desc Device Load Profile
// @route POST /api/device/profile
// @access Private
deviceRouter.get("/profile", isAuthDevice, loadProfile);

// @desc Get all the videos for with respected queues
// @route GET /api/device/load-queues
// @access Private
deviceRouter.post("/increment", incPlayed);

deviceRouter.get("/load-queues", isAuthDevice, loadQueues);

// @desc Get the report of all deices
// @route POST /api/device/report/device/:id
// @access Public

deviceRouter.post("/report/device/:id", getDeviceReport);

// @desc Logout
// @route DELETE /api/admins/logout
// @access Private
deviceRouter.delete(
  "/logout",
  logout("Viznx_Secure_Device_Session_ID", "Viznx_device_Status")
);

export default deviceRouter;
