import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true },
  userId: { type: String },
  type: { type: String, default: "qrCode" },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

urlSchema.index({ shortCode: 1, userId: 1, type: 1 }, { unique: true });

export default mongoose.model("Links", urlSchema);
