import mongoose from "mongoose";
import bcrypt from "bcrypt";
const QueueSchema = mongoose.Schema({
  ad: { type: mongoose.Types.ObjectId, ref: "Ad" },
  operator: { type: mongoose.Types.ObjectId, ref: "Operator" },
  adFrequency: { type: Number, default: 1 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const DeviceSchema = mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  slots: {
    type: [
      {
        name: {
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
            "slotEleven",
            "slotTwelve",
            "slotThirteen",
            "slotFourteen",
          ],
        },
        queue: [QueueSchema],
      },
    ],
    default: [
      {
        name: "slotOne",
        queue: [],
      },
      {
        name: "slotTwo",
        queue: [],
      },
      {
        name: "slotThree",
        queue: [],
      },
      {
        name: "slotFour",
        queue: [],
      },
      {
        name: "slotFive",
        queue: [],
      },
      {
        name: "slotSix",
        queue: [],
      },
      {
        name: "slotSeven",
        queue: [],
      },
      {
        name: "slotEight",
        queue: [],
      },
      {
        name: "slotNine",
        queue: [],
      },
      {
        name: "slotTen",
        queue: [],
      },
      {
        name: "slotEleven",
        queue: [],
      },
      {
        name: "slotTwelve",
        queue: [],
      },
      {
        name: "slotThirteen",
        queue: [],
      },
      {
        name: "slotFourteen",
        queue: [],
      },
    ],
    validate: [
      {
        validator: function (slots) {
          return slots.length <= 14;
        },
        message: "Device can only have a maximum of 14 slots.",
      },
      {
        validator: function (slots) {
          const slotNames = slots.map((slot) => slot.name);
          return slotNames.length === new Set(slotNames).size;
        },
        message: "Slot names must be unique.",
      },
    ],
  },
  status: {
    type: Boolean,
    default: false,
  },
});

DeviceSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

DeviceSchema.methods.toJSON = function () {
  const device = this;
  const deviceObj = device.toObject();
  delete deviceObj.password;
  if (deviceObj.passwordResetToken) delete deviceObj.passwordResetToken;
  if (deviceObj.passwordResetExpires) delete deviceObj.passwordResetExpires;

  return deviceObj;
};

DeviceSchema.pre("save", async function (next) {
  // if not password modified (if an existed device updates the email and name)
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Device = mongoose.models.Device || mongoose.model("Device", DeviceSchema);
export default Device;
