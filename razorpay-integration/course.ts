import { Router } from "express";
import { prisma } from "./db";
import { auth } from "./authMiddleware";

const courseRouter = Router();

// Create a new course
courseRouter.post("/create", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      res.status(400).json({ error: "Course title is required" });
      return;
    }

    const course = await prisma.course.create({
      data: {
        title,
      },
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Course creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all courses
courseRouter.get("/", async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    res.status(200).json({ courses });
  } catch (error) {
    console.error("Fetch courses error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user's courses with access
courseRouter.get("/my-courses", auth, async (req, res) => {
  try {
    //@ts-ignore
    const userId = req.userId;

    const courseAccess = await prisma.courseAccess.findMany({
      where: {
        userId,
        status: "ACTIVE",
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        course: true,
      },
    });

    res.status(200).json({
      courses: courseAccess.map((ca) => ({
        ...ca.course,
        expiresAt: ca.expiresAt,
      })),
    });
  } catch (error) {
    console.error("Fetch my courses error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default courseRouter; 