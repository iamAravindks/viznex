import { Router } from "express";
import {
  customerLogin,
  customerSignUp,
  getAds,
  loadDevices,
  loadProfileCustomer,
} from "../controllers/customerController.js";
import { getAdHistory, loadAd } from "../controllers/operatorController.js";
import { logout } from "../controllers/otherController.js";
import { isAuthCustomer } from "../middlewares/middlewares.js";

const customerRouter = Router();

// @desc customer Login
// @route POST /api/customer/login
// @access Private

customerRouter.post("/login", customerLogin);

// @desc customer Profile
// @route GET /api/customer/profile
// @access Private

customerRouter.get("/profile", isAuthCustomer, loadProfileCustomer);

// @desc Logout
// @route DELETE /api/admins/logout
// @access Private
customerRouter.delete(
  "/logout",
  logout("Viznx_Secure_Customer_Session_ID", "Viznx_customer_Status")
);

customerRouter.get('/loadads/:id', getAds)
customerRouter.post('/ad/:id', getAdHistory)
customerRouter.post('/load-devices/:id', loadDevices)
export default customerRouter;
