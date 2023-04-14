import bcrypt from "bcrypt";
import mongoose from "mongoose";
import crypto from "crypto";
import isEmail from "validator/lib/isEmail.js";

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    validate: isEmail,
  },
  password: { type: String, required: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
  customers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  ],
});

AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
AdminSchema.pre("save", async function (next) {
  // if not password modified (if an existed user updates the email and name)
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

AdminSchema.methods.toJSON = function () {
  const admin = this;
  const adminObject = admin.toObject();
  delete adminObject.password;
  if (adminObject.passwordResetToken) delete adminObject.passwordResetToken;
  if (adminObject.passwordResetExpires) delete adminObject.passwordResetExpires;

  return adminObject;
};

AdminSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

AdminSchema.index({ email: 1, name: 1 }, { unique: true });

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
export default Admin;
