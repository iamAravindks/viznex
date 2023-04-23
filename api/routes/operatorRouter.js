import { Router } from "express";
import {
  addTheAdToQueue,
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  getIncPlayed,
  incPlayed,
  loadAd,
  loadAds,
  loadDevices,
  loadProfile,
  operatorLogin,
  updateCustomer,
  updateQueue,
} from "../controllers/operatorController.js";
import {
  fetchDevices,
  getDeviceById,
} from "../controllers/deviceController.js";
import { isAuthDevice, isAuthOperator } from "../middlewares/middlewares.js";
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

// @desc update queue
// @route PATCH /api/operator/update-queue
// @access Private

operatorRouter.patch("/update-queue", isAuthOperator, updateQueue);

// @desc fetch all the devices
// @route GET /api/operator/load-devices
// @access Private

operatorRouter.get("/load-devices", isAuthOperator, fetchDevices);
operatorRouter.get("/load-customers", isAuthOperator, fetchCustomers);
operatorRouter.delete("/customer/:id", isAuthOperator, deleteCustomer);
operatorRouter.patch("/customer/:id", isAuthOperator, updateCustomer);
operatorRouter.post("/incvalue",  getIncPlayed);

// @desc Fetch the Profile
// @route Get /api/operator/profile
// @access Private
operatorRouter.get("/profile", isAuthOperator, loadProfile);

// @desc create a new customer
// @route POST /api/operator/create-customer
// @access Private

operatorRouter.post("/create-customer", isAuthOperator, createCustomer);

// @desc Load ads from operator
//@route GET /api/operator/load-ads
// @access Private

operatorRouter.get("/load-ads", isAuthOperator, loadAds);
operatorRouter.get("/load-ad/:id", isAuthOperator, loadAd);

// @desc Load ads from operator
//@route GET /api/operator/load-device-details
// @access Private

operatorRouter.get("/load-device-details", isAuthOperator, loadDevices);

// @desc GET a device by id
// @route GET /api/operator/device/:id
// @access Private

operatorRouter.get("/device/:id", isAuthOperator, getDeviceById);

// @desc Logout
// @route DELETE /api/operator/logout
// @access Private
operatorRouter.delete(
  "/logout",
  logout("Viznx_Secure_Operator_Session_ID", "Viznx_operator_Status")
);
export default operatorRouter;
