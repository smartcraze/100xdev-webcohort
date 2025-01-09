import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true, // This will serve as the query parameter
      trim: true,
      lowercase: true, // Ensures consistency
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
