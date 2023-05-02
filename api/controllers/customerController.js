import expressAsyncHandler from "express-async-handler";
import mongoose, { Error } from "mongoose";
import Ad from "../models/AdModel.js";
import Customer from "../models/customerSchema.js";
import Device from "../models/DeviceModel.js";
import Operator from "../models/OperatorModel.js";
import generateToken from "../utils/utils.js";

// @desc customer signup
// @access Private

export const customerSignUp = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(200).json({
      message: "Customer fields are required",
    });
  }

  try {
    const customerExists = await Customer.findOne({ email });

    if (customerExists) {
      res.status(400);
      throw new Error(`Customer with email id ${email} is already exists`);
    }
    const customer = await Customer.create({
      name,
      email,
      password,
    });
    if (customer) {
      const maxAge = 3 * 24 * 60 * 60;
      const token = generateToken(customer._id);
      res.cookie("Viznx_Secure_Customer_Session_ID", token, {
        maxAge: maxAge * 1000,
        domain: "viznx.in",
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.cookie("Viznx_customer_Status", customer._id, {
        maxAge: maxAge * 1000,
        domain: "viznx.in",
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.status(201).json(customer.toJSON());
    } else {
      res.status(500);
      throw new Error("Oops, something is not working! try again");
    }
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

// @desc customer login
// @access Private

export const customerLogin = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(200).json({
      message: "Customer fields are required",
    });
  }

  try {
    const customer = await Customer.findOne({ email })
      

    if (!customer) {
      res.status(404);
      throw new Error("Invalid email");
    }

    if (customer && (await customer.matchPassword(password))) {
      const maxAge = 3 * 24 * 60 * 60;
      const token = generateToken(customer._id);
      res.cookie("Viznx_Secure_Session_ID", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      });
      res.status(200).json(customer.toJSON());
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

export const loadProfileCustomer = expressAsyncHandler(async (req, res) => {
  try {
    const customer = await Customer.findById(
      new mongoose.Types.ObjectId(req.customer._id)
    );

    if (customer) {
      res.status(200);
      res.json(customer.toJSON());
    } else {
      throw new Error();
    }
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

// @desc Get the data of a customer by id
// @access Private

export const getCustomers = expressAsyncHandler(async (req, res) => {
  try {
    const customers = await Customer.find({})
      .select("-password")
      .populate({
        path: "devices",
        select: "deviceId name location",
      })
      .populate({
        path: "ads",
        select: "name url ",
        populate: {
          path: "operator",
          select: "name email location",
        },
      });

    res.status(200).json(customers);
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});

// @desc Get the data of a customer by id
// @access Private

export const getCustomerById = expressAsyncHandler(async (req, res) => {
  try {
    const customer = await Customer.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      { $project: { password: 0 } },
      {
        $lookup: {
          from: "devices",
          localField: "devices",
          foreignField: "_id",
          as: "devices",
        },
      },
      {
        $project: {
          _id: "$_id",
          name: "$name",
          email: "$email",
          devices: {
            $map: {
              input: "$devices",
              as: "device",
              in: {
                _id: "$$device._id",
                deviceId: "$$device.deviceId",
                name: "$$device.name",
                location: "$$device.location",
              },
            },
          },
          ads: "$ads",
        },
      },
      {
        $lookup: {
          from: "ads",
          localField: "ads",
          foreignField: "_id",
          as: "ads",
        },
      },
      { $unwind: "$ads" },
      {
        $lookup: {
          from: "operators",
          localField: "ads.operator",
          foreignField: "_id",
          as: "ads.operator",
        },
      },

      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          devices: { $first: "$devices" },
          ads: {
            $addToSet: {
              _id: "$ads._id",
              name: "$ads.name",
              url: "$ads.url",
              operator: {
                _id: { $arrayElemAt: ["$ads.operator._id", 0] },
                name: { $arrayElemAt: ["$ads.operator.name", 0] },
                location: { $arrayElemAt: ["$ads.operator.location", 0] },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: "$_id",
          name: "$name",
          email: "$email",
          devices: "$devices",
          ads: "$ads",
        },
      },
    ]);

    if (!customer) {
      res.status(404);
      throw new Error("No customer found,try again");
    }

    res.status(200).json(customer);
  } catch (error) {
    throw new Error(error.message ? error.message : "Internal server error");
  }
});


export const getAds = expressAsyncHandler(async (req, res) => {
  const customerId = req.params.id; // Rename `id` to `customerId` for clarity

  // Find all ads that belong to the customer and populate the `customer` field
  const ads = await Ad.find({ customer: customerId }).populate('customer');

  // Create a new array to hold the updated ads
  const newAds = [];

  for (let i = 0; i < ads.length; i++) {
    // Find the operator that owns the current ad and populate the `adsUnderOperator.ad.customer` field
    const operator = await Operator.findById(ads[i].operator).populate({
      path: 'adsUnderOperator.ad',
      populate: { path: 'customer' },
    });

    // Find the ad object with the particular ID
    const adWithId = operator.adsUnderOperator.find(ad => ad.ad.customer._id.toString() === customerId);

    if (adWithId) {
      // Create a new object that contains the original ad, the operator details, and the ad object with the particular ID
      const newAd = {
        ...ads[i]._doc, // use the spread operator to copy the original ad object
        adWithId: adWithId,
      };

      // Push the new object to the newAds array
      newAds.push(newAd);
    }
  }

  // Send the newAds array as a JSON response
  res.json({ customerId, ads: newAds });
});


export const loadDevices = expressAsyncHandler( async(req,res) => {
  try {
    const adId = req.params.id;
    const operatorId = req.body.id
    const operator = await Operator.findById(operatorId).populate({
      path: "adsUnderOperator.ad",
      populate: {
        path: "customer",
      },
      populate:{
        path: "operator"
      }
    });
    const ad = operator.adsUnderOperator.id(adId);
    const groupedDevices = ad.deployedDevices.reduce((acc, curr) => {
      const deviceId = curr.device;
      if (!acc[deviceId]) {
        acc[deviceId] = [];
      }
      acc[deviceId].push(curr);
      return acc;
    }, {});
    const groupedSlots =await Promise.all(Object.keys(groupedDevices).map(async(deviceId) => {
      const deviceDetails = await Device.findById(deviceId)
      
      return {
        deviceDetails:deviceDetails,
        deviceId: deviceId,
        slots: groupedDevices[deviceId],
      };
    }));
    res.json({
      ad:ad,
      groupedSlots:groupedSlots,
      groupedDevices:groupedDevices
    })
  } catch (error) {
    console.log(error)
  }
})

