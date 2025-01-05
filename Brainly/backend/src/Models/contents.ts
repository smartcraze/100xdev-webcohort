import { Schema, Types, model } from "mongoose";

const ContentSchema = new Schema({
  link: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["image", "video", "article", "audio"],
  },
  title: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: Types.ObjectId,
      ref: "Tag",
    },
  ],
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Content = model("Contents", ContentSchema);
export default Content;
