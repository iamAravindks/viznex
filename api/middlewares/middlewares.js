import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import config from "../config.js";
import Admin from "../models/adminModel.js";
import Device from "../models/DeviceModel.js";
import Operator from "../models/OperatorModel.js";

const notFound = (req, res, next) => {
  const err = new Error(`Error 404 : ${req.method} ${req.url} not found`);
  res.status(404);
  next(err);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

const isAuthAdmin = expressAsyncHandler(async (req, res, next) => {
  const token = req.cookies["Viznx_Secure_Session_ID"];
  if (token) {
    try {
      const decodedObj = jwt.verify(
        token,
        config.JWT_SECRET,
        (err, decoded) => {
          if (err) {
            res.status(401);
            next(new Error("Session Expired! login required"));
            return;
          }
          return decoded;
        }
      );

      const admin = await Admin.findById(decodedObj.id).select("-password");
      if (admin) {
        req.admin = admin;
        next();
      } else {
        res.status(404);
        next(new Error("No admin found,admin credentials may changed"));
      }
    } catch (error) {
      res.status(401);
      throw new Error("Session Expired! login required");
    }
  } else {
    res.status(401);

    throw new Error(
      "Your session maybe expired or become invalid! Try to login again"
    );
  }
});

const isAuthOperator = expressAsyncHandler(async (req, res, next) => {
  const token = req.cookies["Viznx_Secure_Session_ID"];
  if (token) {
    try {
      const decodedObj = jwt.verify(
        token,
        config.JWT_SECRET,
        (err, decoded) => {
          if (err) {
            res.status(401);
            next(new Error("Session Expired! login required"));
            return;
          }
          return decoded;
        }
      );

      const operator = await Operator.findById(decodedObj.id).select(
        "-password"
      );
      if (operator) {
        req.operator = operator;
        next();
      } else {
        res.status(404);
        next(new Error("No operator found,operator credentials may changed"));
      }
    } catch (error) {
      res.status(401);
      throw new Error("Session Expired! login required");
    }
  } else {
    res.status(401);

    throw new Error(
      "Your session maybe expired or become invalid! Try to login again"
    );
  }
});

const isAuthDevice = expressAsyncHandler(async (req, res, next) => {
  const token = req.cookies["Viznx_Secure_Device_Session_ID"];

  console.log(token);

  if (token) {
    try {
      const decodedObj = jwt.verify(
        token,
        config.JWT_SECRET,
        (err, decoded) => {
          if (err) {
            res.status(401);
            next(new Error("Session Expired! login required"));
            return;
          }
          return decoded;
        }
      );

      const device = await Device.findById(decodedObj.id).select("-password");
      if (device) {
        req.device = device;
        next();
      } else {
        res.status(404);
        next(new Error("No device found,device credentials may changed"));
      }
    } catch (error) {
      res.status(401);

      throw new Error("Session Expired! login required");
    }
  } else {
    res.status(401);

    throw new Error(
      "Your session maybe expired or become invalid! Try to login again"
    );
  }
});

export { notFound, errorHandler, isAuthAdmin, isAuthOperator, isAuthDevice };
