import { Router } from "express";
import {
  adminLogin,
  adminSignUp,
  createDevice,
  createOperator,
  deleteDeviceId,
  deleteOperatorId,
  editOperatorId,
  loadProfile,
  updateDevice,
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

// @desc edit a device
// @route PATCH /api/admin/device/:id
// @access Private

adminRouter.patch("/device/:id", isAuthAdmin, updateDevice);

// @desc delete a device
// @route DELETE /api/admin/device/:id
// @access Private

adminRouter.delete("/device/:id", isAuthAdmin, deleteDeviceId);

// @desc fetch all the devices
// @route GET /api/admin/load-admin-devices
// @access Private

adminRouter.get("/load-admin-devices", isAuthAdmin, fetchDevices);

// @desc fetch all the operators
// @route GET /api/admin/load-admin-operators
// @access Private

adminRouter.get("/load-admin-operators", isAuthAdmin, fetchOperators);

// @desc Edit a operator by id
// @route PATCH /api/admin/edit-operator/:id
// @access Private

adminRouter.patch("/edit-operator/:id", isAuthAdmin, editOperatorId);

// @desc DELETE a operator by id
// @route DELETE /api/admin/delete-operator/:id
// @access Private

adminRouter.delete("/delete-operator/:id", isAuthAdmin, deleteOperatorId);

export default adminRouter;
