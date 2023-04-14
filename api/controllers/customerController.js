import expressAsyncHandler from "express-async-handler";
import Customer from "../models/customerSchema.js";
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
      res.cookie("Viznx_Secure_Session_ID", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      });
      res.cookie("Viznx_customer_Status", customer._id, {
        maxAge: maxAge * 1000,
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
    const customer = await Customer.findOne({ email });

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
