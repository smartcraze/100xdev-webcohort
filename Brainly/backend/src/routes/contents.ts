import { Router } from "express";
import { z } from "zod";
import auth from "../middleware/auth";
import Content from "../Models/contents";

export const contentsRouter = Router();

const ContentValidationSchema = z.object({
  link: z.string().url(),
  type: z.enum(["image", "video", "article", "audio"]),
  title: z.string().min(1),
  //   tags: z.array(z.string()),
});

contentsRouter.post("/add", auth, async (req, res) => {
  try {
    const { link, type, title } = ContentValidationSchema.parse(req.body);
    await Content.create({
      link,
      type,
      title,
      tags: [],
      userId: req.userId,
    });
    
  } catch (error) {
    console.log(error);
  }
});
