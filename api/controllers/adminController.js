import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Admin from "../models/adminModel.js";
import Device from "../models/DeviceModel.js";
import Operator from "../models/OperatorModel.js";
import generateToken from "../utils/utils.js";

// @desc Register a admin , NB:There is only one admin user here
// @access Private
export const adminSignUp = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(200).json({
      message: "Admin fields are required",
    });
  }

  try {
    const adminData = await Admin.countDocuments({});
    console.log(adminData);
    if (adminData > 0) {
      res.status(400);
      throw new Error("There is already an admin");
    }
    const admin = await Admin.create({
      name,
      email,
      password,
    });
    if (admin) {
      const maxAge = 3 * 24 * 60 * 60;
      const token = generateToken(admin._id);
      res.cookie("Viznx_Secure_Session_ID", token, {
        maxAge: maxAge * 1000,
        domain: ".viznx.in",
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.cookie("Viznx_admin_Status", admin._id, {
        maxAge: maxAge * 1000,
        domain: ".viznx.in",
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      });
    } else {
      res.status(400);
      throw new Error("Admin already exists");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc Admin  login
// @access Private

export const adminLogin = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(200).json({
      message: "Admin fields are required",
    });
  }

  try {
    const admin = await Admin.findOne({ email, name });

    if (admin && (await admin.matchPassword(password))) {
      const maxAge = 3 * 24 * 60 * 60;
      const token = generateToken(admin._id);
      res.cookie("Viznx_Secure_Session_ID", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      });
      res.cookie("Viznx_admin_Status", admin._id, {
        maxAge: maxAge * 1000,
        httpOnly: true,
      });
      res.status(201).json(admin.toJSON());
    } else {
      res.status(401);
      throw new Error("invalid password or email");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc create operator
// @access private

export const createOperator = expressAsyncHandler(async (req, res) => {
  const { name, email, password, location } = req.body;

  if (!name || !email || !password || !location) {
    return res.status(200).json({
      message: "Operator fields are required",
    });
  }

  try {
    const operatorExists = await Operator.findOne({ email });

    if (operatorExists) {
      res.status(409);
      throw new Error("Operator already exists");
    }

    const operator = await Operator.create({
      name,
      email,
      password,
      location,
    });

    if (operator) {
      res.status(201).json({
        message: "Operator creation success",
      });
    }
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});

// @desc create a device
// @access Private

export const createDevice = expressAsyncHandler(async (req, res) => {
  const { deviceId, name, password, location } = req.body;

  if (!deviceId || !name || !password || !location) {
    return res.status(200).json({
      message: "Device fields are required",
    });
  }

  try {
    const deviceExists = await Device.findOne({ deviceId, name });

    if (deviceExists) {
      res.status(409);
      throw new Error("Device already exists");
    }

    const device = await Device.create({ deviceId, name, password, location });

    if (device) {
      res.status(201).json({
        message: "Device creation success",
      });
    }
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});

export const loadProfile = expressAsyncHandler(async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (admin) {
      return res.status(200).json(admin.toJSON());
    } else {
      res.status(400);
      throw new Error("Bad request");
    }
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});

// @desc Update a device
// @access Private

export const updateDevice = expressAsyncHandler(async (req, res) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.params.id);
    console.log(req.params.id);
    const device = await Device.findById(_id);

    if (!device) {
      res.status(404);
      throw new Error("Device not found");
    }

    const {
      name = device.name,
      location = device.location,
      deviceId = device.deviceId,
    } = req.body;

    const result = await Device.updateOne(
      {
        _id,
      },
      {
        name,
        location,
        deviceId,
      }
    );

    if (result.nModified === 0) {
      res.status(500);
      throw new Error("Device not updated");
    }
    const devices = await Device.find({}).select("-password");

    res.status(200).json(devices);
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});

// @desc Delete a device
// @access Private

export const deleteDeviceId = expressAsyncHandler(async (req, res) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.params.id);
    console.log(req.params.id);
    const device = await Device.findById(_id);

    if (!device) {
      res.status(404);
      throw new Error("Device not found");
    }

    const result = await Device.deleteOne({
      _id,
    });

    if (result.deletedCount === 0) {
      res.status(500);
      throw new Error("Device not deleted");
    }
    const devices = await Device.find({}).select("-password");

    res.status(200).json(devices);
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});

// @desc Edit a operator by id
// @route PATCH /api/admin/edit-operator/;id
// @access Private

export const editOperatorId = expressAsyncHandler(async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400);
      throw new Error("Oops! Bad request ");
    }
    const operator = await Operator.findById(req.params.id);
    if (!operator) {
      res.status(404);
      throw new Error("No operator found,check again");
    }
    const {
      name = operator.name,
      email = operator.email,
      location = operator.location,
    } = req.body;
    console.log(name);
    operator.name = name;
    operator.email = email;
    operator.location = location;

    if (req.body.password) {
      operator.password = req.body.password;
    }
    await operator.save();

    const operators = await Operator.find({}).select("name email location");
    return res.status(200).json(operators);
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});

// @desc Delete a operator by id
// @access Private

export const deleteOperatorId = expressAsyncHandler(async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400);
      throw new Error("Oops! Bad request ");
    }
    const operator = await Operator.findById(req.params.id);
    if (!operator) {
      res.status(404);
      throw new Error("No operator found,check again");
    }
    const deleteOperator = await Operator.deleteOne({
      _id: req.params.id,
    });

    if (deleteOperator.deletedCount === 0) {
      res.status(500);
      throw new Error("Device not deleted");
    }

    const operators = await Operator.find({}).select("name email location");
    return res.status(200).json(operators);
  } catch (error) {
    throw new Error(
      error.message ? error.message : "Internal server error,try again"
    );
  }
});
