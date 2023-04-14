import mongoose from "mongoose";
import bcrypt from "bcrypt";
import isEmail from "validator/lib/isEmail.js";

const DeployedDevices = mongoose.Schema({
  device: { type: mongoose.Schema.Types.ObjectId, ref: "Device" },

  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  slot: {
    slotType: {
      type: String,
      required: true,
      enum: [
        "slotOne",
        "slotTwo",
        "slotThree",
        "slotFour",
        "slotFive",
        "slotSix",
        "slotSeven",
        "slotEight",
        "slotNine",
        "slotTen",
      ],
    },
    noOfTimesPlayed: { type: String, default: 0 },
  },
});

const OperatorSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: [true, "Email is required"],
    index: true,
    unique: true,
    validate: isEmail,
  },
  password: { type: String, required: true },
  location: { type: String, required: true },
  passwordResetToken: String,
  passwordResetExpires: Date,

  // ads under operator and the devices that runs
  adsUnderOperator: [
    {
      ad: { type: mongoose.Schema.Types.ObjectId, ref: "Ad", index: true },
      deployedDevices: [DeployedDevices],
    },
  ],
});

OperatorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

OperatorSchema.methods.toJSON = function () {
  const operator = this;
  const operatorObj = operator.toObject();
  delete operatorObj.password;
  if (operatorObj.passwordResetToken) delete operatorObj.passwordResetToken;
  if (operatorObj.passwordResetExpires) delete operatorObj.passwordResetExpires;

  return operatorObj;
};

OperatorSchema.pre("save", async function (next) {
  // if not password modified (if an existed user updates the email and name)
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

OperatorSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const Operator =
  mongoose.models.Operator || mongoose.model("Operator", OperatorSchema);
export default Operator;
