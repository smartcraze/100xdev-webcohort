import mongoose, { model, Schema } from "mongoose";

const TagSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
});

export default model("Tag", TagSchema);
