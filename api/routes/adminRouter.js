import { Router } from "express";
import {
  adminLogin,
  adminSignUp,
  createDevice,
  createOperator,
  loadProfile,
} from "../controllers/adminController.js";
import { fetchDevices } from "../controllers/deviceController.js";
import { fetchOperators } from "../controllers/operatorController.js";
import { logout } from "../controllers/otherController.js";
import { isAuthAdmin } from "../middlewares/middlewares.js";

const adminRouter = Router();

// @desc admin creation . NB: there is only one single admin there
// @route POST /api/admin/signup
// @access Public

adminRouter.post("/signup", adminSignUp);

// @desc admin Login
// @route POST /api/admin/login
// @access Private

adminRouter.post("/login", adminLogin);

// @desc fetch admin profile
// @route GET  /api/admin/profile
// @access Private

adminRouter.get("/load-profile", isAuthAdmin, loadProfile);

// @desc Logout
// @route DELETE /api/admin/logout
// @access Private
adminRouter.delete(
  "/logout",
  logout("Viznx_Secure_Session_ID", "Viznx_admin_Status")
);

// @desc create operator
// @route POST /api/admin/create-operator
// @access Private

adminRouter.post("/create-operator", isAuthAdmin, createOperator);

// @desc create device
// @route POST /api/admin/create-device
// @access Private

adminRouter.post("/create-device", isAuthAdmin, createDevice);

// @desc fetch all the devices
// @route GET /api/admin/load-admin-devices
// @access Private

adminRouter.get("/load-admin-devices", isAuthAdmin, fetchDevices);

// @desc fetch all the operators
// @route GET /api/admin/load-admin-operators
// @access Private

adminRouter.get("/load-admin-operators", isAuthAdmin, fetchOperators);

export default adminRouter;
