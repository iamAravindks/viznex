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
  // should we add the devices that plays this ad in here or create another function for this
});

const Ad = mongoose.models.Ads || mongoose.model("Ad", AdSchema);

export default Ad;
