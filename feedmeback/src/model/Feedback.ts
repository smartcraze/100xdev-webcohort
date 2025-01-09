import { model, Schema, Types } from "mongoose";

const feedbackSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  feedbackText: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  customerName: {
    type: String,
    trim: true,
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = model("Feedback", feedbackSchema);

export default Feedback;
