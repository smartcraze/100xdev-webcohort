import { Router } from "express";
import { z } from "zod";
import auth from "../middleware/auth";
import Content from "../Models/contents";

export const contentsRouter = Router();

const ContentValidationSchema = z.object({
  link: z.string().url(),
  type: z.enum(["image", "video", "article", "audio"]),
  title: z.string().min(1),
});

// post
contentsRouter.post("/", auth, async (req, res) => {
  try {
    const { link, type, title } = ContentValidationSchema.parse(req.body);
    const addedcontents = await Content.create({
      link,
      type,
      title,
      tags: [],
      userId: req.userId,
    });
    res.status(200).json({
      Message: "Created successFully",
      Content: addedcontents,
    });
  } catch (error) {
    console.log(error);
    res.json(400).json({
      Message: "Error creating contents",
    });
  }
});
// get
contentsRouter.get("/", auth, async (req, res) => {
  try {
    const AllContent = await Content.find({ userId: req.userId });
    res.status(200).json({
      Message: "Fetched Successfully",
      Content: AllContent,
    });
  } catch (error: any) {
    res.status(400).json({
      Message: "Error fetching contents",
      error: error,
    });
  }
});

//  delete
contentsRouter.delete("/", auth, async (req, res) => {
  try {
    const { contentId } = req.body;
    const deletedContents = await Content.deleteMany({ _id: contentId });
    if (!deletedContents) {
      res.status(400).json({
        Message: "Contents Not found",
      });
    }
    res.json({
      Message: "Deleted",
    });
  } catch (error: any) {
    res.json({
      Message: "Error deleting",
      Error: error,
    });
  }
});
