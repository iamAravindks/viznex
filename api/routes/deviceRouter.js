import { Router } from "express";
import {
  deviceLogin,
  getAdForecastReport,
  getDeviceReport,
  loadProfile,
  loadQueues,
} from "../controllers/deviceController.js";
import { incNoTimesPlayed } from "../controllers/operatorController.js";
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
deviceRouter.post("/increment", incNoTimesPlayed);

deviceRouter.get("/load-queues", isAuthDevice, loadQueues);

// @desc Get the report of all deices
// @route POST /api/device/report/device/:id
// @access Public

deviceRouter.post("/report/device/:id", getDeviceReport);

// @desc get adForecastReport of a device
// @route POST /api/device/ad-forecast/
// @access Public

deviceRouter.post("/ad-forecast/", getAdForecastReport);

// @desc Logout
// @route DELETE /api/admins/logout
// @access Private
deviceRouter.delete(
  "/logout",
  logout("Viznx_Secure_Device_Session_ID", "Viznx_device_Status")
);

export default deviceRouter;
