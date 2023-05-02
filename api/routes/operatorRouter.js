import { Router } from "express";
import {
  addTheAdToQueue,
  createCustomer,
  deleteAdQueue,
  deleteCustomer,
  fetchCustomers,
  getAdHistory,
  incNoTimesPlayed,
  loadAd,
  loadAdData,
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
  getDeviceByIdDate,
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

// @desc delete an ad from all devices,customer, operator which is set by a operator
// @route DELETE /api/operator/delete-ad-queue
// @access Private

operatorRouter.delete("/delete-ad-queue", isAuthOperator, deleteAdQueue);

operatorRouter.delete;

// @desc fetch all the devices
// @route GET /api/operator/load-devices
// @access Private

operatorRouter.get("/load-devices", isAuthOperator, fetchDevices);
operatorRouter.get("/load-customers", isAuthOperator, fetchCustomers);
operatorRouter.delete("/customer/:id", isAuthOperator, deleteCustomer);
operatorRouter.patch("/customer/:id", isAuthOperator, updateCustomer);
//operatorRouter.post("/incvalue", getIncPlayed);

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
operatorRouter.post("/load-ad/:id", isAuthOperator, loadAd);

// @desc Generate report based on a ad
// @route GET /api/operator/report/ad/:id
// @access Public

operatorRouter.post("/report/ad/:id", getAdHistory);

// @desc Load ads from operator
//@route GET /api/operator/load-device-details
// @access Private

operatorRouter.get("/load-device-details", loadDevices);

// @desc GET a device by id
// @route GET /api/operator/device/:id
// @access Private

operatorRouter.get("/device/:id", isAuthOperator, getDeviceById);

// @desc GET a device by id and filter ads with dat
// @route POST /api/operator/device/:id
// @access Private

operatorRouter.post("/device/:id/", isAuthOperator, getDeviceByIdDate);

// @desc increment a ads noOfTimesPlayed for date under a device in a slot
// @route POST /api/operator/inc-ad
// @access Public

operatorRouter.post("/incad", incNoTimesPlayed);
operatorRouter.get("/loadAdData/:id", isAuthOperator, loadAdData);
// @desc Logout
// @route DELETE /api/operator/logout
// @access Private
operatorRouter.delete(
  "/logout",
  logout("Viznx_Secure_Operator_Session_ID", "Viznx_operator_Status")
);
export default operatorRouter;
