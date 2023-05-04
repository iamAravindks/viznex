import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  operator: {
    type: mongoose.Types.ObjectId,
    ref: "Operator",
    required: true,
  },
  devices: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Device",
    },
  ],
});

export const Group =
  mongoose.models.Group || mongoose.model("Group", GroupSchema);
