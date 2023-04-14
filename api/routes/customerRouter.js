import { Router } from "express";
import {
  customerLogin,
  customerSignUp,
} from "../controllers/customerController.js";
import { logout } from "../controllers/otherController.js";

const customerRouter = Router();

// @desc customer signup
// @route POST /api/customer/signup
// @access Private

customerRouter.post("/signup", customerSignUp);

// @desc customer Login
// @route POST /api/customer/login
// @access Private

customerRouter.post("/login", customerLogin);

// @desc Logout
// @route DELETE /api/admins/logout
// @access Private
customerRouter.delete(
  "/logout",
  logout("Viznx_Secure_Session_ID", "Viznx_customer_Status")
);

export default customerRouter;
