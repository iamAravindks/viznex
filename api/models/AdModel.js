import mongoose from "mongoose";
import isURL from "validator/lib/isURL.js";

export const AdSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    validate: isURL,
  },
  operator: {
    type: mongoose.Types.ObjectId,
    ref: "Operator",
    required: true,
  },
  customer: {
    type: mongoose.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  created_at: { type: Date },
  updated_at: { type: Date },
  // should we add the devices that plays this ad in here or create another function for this
});
AdSchema.pre("save", function (next) {
  const now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

const Ad = mongoose.models.Ads || mongoose.model("Ad", AdSchema);

export default Ad;
