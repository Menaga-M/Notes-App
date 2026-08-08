import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  content: { type: String, trim: true, maxlength: 5000, default: "" },
  isFavorite: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Note", noteSchema);
