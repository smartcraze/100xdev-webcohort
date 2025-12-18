import express from "express";
import { prisma } from "./db";
import crypto from "crypto";
import userRouter from "./user";
import courseRouter from "./course";
import { auth, type AuthRequest } from "./authMiddleware";
import axios from "axios";
import { billingInitSchema, paymentVerifySchema, type PricingConfig } from "./types";
import { env } from "./env";
import { PaymentType, type PlanType } from "./generated/prisma/enums";
import path from "path";

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, x-user-id");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, "frontend")));

app.use("/user", userRouter);
app.use("/course", courseRouter);

const COURSE_PRICING: Record<PlanType, PricingConfig> = {
  MONTHLY: {
    amount: 99900,
    currency: "INR",
  },
  YEARLY: {
    amount: 999900,
    currency: "INR",
  },
};

app.post("/billing/init", auth, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Validate request body with Zod
    const validation = billingInitSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: "Invalid request data",
        details: validation.error.issues,
      });
      return;
    }

    const { courseId, plan } = validation.data;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    // Check if user already has active access
    const existingAccess = await prisma.courseAccess.findFirst({
      where: {
        userId,
        courseId,
        status: "ACTIVE",
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (existingAccess) {
      res.status(409).json({
        error: "You already have active access to this course",
      });
      return;
    }

    const pricing = COURSE_PRICING[plan];

    // Create Razorpay order
    const authHeader = `Basic ${Buffer.from(
      `${env.RZP_KEY}:${env.RZP_SECRET}`
    ).toString("base64")}`;

    const orderPayload = {
      amount: pricing.amount,
      currency: pricing.currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId,
        courseId,
        plan,
      },
    };

    const order = await axios.post(
      "https://api.razorpay.com/v1/orders",
      orderPayload,
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    // Create payment history record
    await prisma.paymentHistory.create({
      data: {
        userId,
        courseId,
        paymentType: "ORDER",
        planType: plan,
        status: "PENDING",
        razorpayOrderId: order.data.id,
        amount: pricing.amount,
        currency: pricing.currency,
      },
    });

    res.status(200).json({
      orderId: order.data.id,
      key: env.RZP_KEY,
      amount: pricing.amount,
      currency: pricing.currency,
      courseTitle: course.title,
    });
  } catch (error) {
    console.error("Billing init error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify Payment (for development - alternative to webhook)
app.post("/billing/verify", auth, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }


    console.log("Request Body:", req.body);

    const validation = paymentVerifySchema.safeParse(req.body);
    if (!validation.success) {
      console.log("Validation Failed:", validation.error.issues);
      res.status(400).json({
        error: "Invalid request data",
        details: validation.error.issues,
      });
      return;
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = validation.data;

    console.log("Order ID:", razorpay_order_id);
    console.log("Payment ID:", razorpay_payment_id);
    console.log("Signature from Razorpay:", razorpay_signature);

    const text = razorpay_order_id + "|" + razorpay_payment_id;
    console.log("Text to sign:", text);

    const expectedSignature = crypto
      .createHmac("sha256", env.RZP_SECRET)
      .update(text)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.log(" Signature verification failed!");
      res.status(400).json({ error: "Invalid payment signature" });
      return;
    }

    console.log(" Signature verified successfully");

    const paymentHistory = await prisma.paymentHistory.findFirst({
      where: {
        razorpayOrderId: razorpay_order_id,
        userId,
        status: "PENDING",
      },
    });

    console.log("Payment History Found:", paymentHistory ? "Yes" : "No");

    if (!paymentHistory) {
      res.status(404).json({ error: "Payment not found or already processed" });
      return;
    }

    console.log("Payment Details:", {
      courseId: paymentHistory.courseId,
      planType: paymentHistory.planType,
      amount: paymentHistory.amount,
    });

    await prisma.paymentHistory.update({
      where: { id: paymentHistory.id },
      data: {
        status: "SUCCESS",
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    console.log(" Payment status updated to SUCCESS");

    const expiresAt = new Date();
    if (paymentHistory.planType === "MONTHLY") {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      console.log("Access granted for: 1 month");
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      console.log("Access granted for: 1 year");
    }

    console.log("Access expires at:", expiresAt);

    await prisma.courseAccess.upsert({
      where: {
        userId_courseId: {
          userId: paymentHistory.userId,
          courseId: paymentHistory.courseId,
        },
      },
      update: {
        expiresAt,
        status: "ACTIVE",
      },
      create: {
        userId: paymentHistory.userId,
        courseId: paymentHistory.courseId,
        expiresAt,
        status: "ACTIVE",
      },
    });


    res.status(200).json({
      success: true,
      message: "Payment verified and course access granted",
      expiresAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/billing/webhook", async (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"] as string;
    const { event, payload } = req.body;

    if (!webhookSignature) {
      res.status(400).json({ error: "Missing signature" });
      return;
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", env.RZP_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (expectedSignature !== webhookSignature) {
      res.status(400).json({ error: "Invalid signature" });
      return;
    }

    // Handle payment success events (order.paid or payment.captured)
    if (event === "order.paid" || event === "payment.captured") {
      const payment = payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      // Find payment history
      const paymentHistory = await prisma.paymentHistory.findFirst({
        where: { 
          razorpayOrderId: orderId,
          status: "PENDING" // Only process if still pending
        },
      });

      if (!paymentHistory) {
        // Already processed or not found
        res.status(200).json({ status: "ok", message: "Already processed" });
        return;
      }

      // Update payment status
      await prisma.paymentHistory.update({
        where: { id: paymentHistory.id },
        data: {
          status: "SUCCESS",
          razorpayPaymentId: paymentId,
        },
      });

      // Grant course access
      const expiresAt = new Date();
      if (paymentHistory.planType === "MONTHLY") {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      } else {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }

      await prisma.courseAccess.upsert({
        where: {
          userId_courseId: {
            userId: paymentHistory.userId,
            courseId: paymentHistory.courseId,
          },
        },
        update: {
          expiresAt,
          status: "ACTIVE",
        },
        create: {
          userId: paymentHistory.userId,
          courseId: paymentHistory.courseId,
          expiresAt,
          status: "ACTIVE",
        },
      });
    }

    // Handle payment.failed event
    if (event === "payment.failed") {
      const payment = payload.payment.entity;
      const orderId = payment.order_id;

      await prisma.paymentHistory.updateMany({
        where: { 
          razorpayOrderId: orderId,
          status: "PENDING"
        },
        data: { status: "FAILED" },
      });
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/billing/status", auth, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { orderId, courseId } = req.query;

    const where: any = { userId };
    if (orderId) where.razorpayOrderId = orderId;
    if (courseId) where.courseId = courseId;

    const payments = await prisma.paymentHistory.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ payments });
  } catch (error) {
    console.error("Billing status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/courses/access", auth, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { courseId } = req.query;

    // If specific courseId provided, check access to that course
    if (courseId) {
      const access = await prisma.courseAccess.findFirst({
        where: {
          userId,
          courseId: courseId as string,
          status: "ACTIVE",
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          course: true,
        },
      });

      if (!access) {
        res.status(200).json({
          hasAccess: false,
          message: "No active access to this course",
        });
        return;
      }

      res.status(200).json({
        hasAccess: true,
        course: access.course,
        expiresAt: access.expiresAt,
      });
      return;
    }

    // Otherwise, return all courses user has access to
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
      orderBy: { expiresAt: "desc" },
    });

    res.status(200).json({
      courses: courseAccess.map((ca) => ({
        ...ca.course,
        expiresAt: ca.expiresAt,
      })),
    });
  } catch (error) {
    console.error("Course access error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Serve index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(3000, () => {
  console.log(`app is listening on http://localhost:3000`);
});
