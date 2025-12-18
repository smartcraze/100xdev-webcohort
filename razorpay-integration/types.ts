import { z } from "zod";
import { PlanType } from "./generated/prisma/enums";

// Billing Init Request Schema
export const billingInitSchema = z.object({
  courseId: z.uuid("Invalid course ID"),
  plan: z.enum(PlanType, {
    message: "Plan must be either 'MONTHLY' or 'YEARLY'",
  }),
});

export type BillingInitRequest = z.infer<typeof billingInitSchema>;

// Course Access Query Schema
export const courseAccessSchema = z.object({
  courseId: z.string().uuid("Invalid course ID").optional(),
});

export type CourseAccessRequest = z.infer<typeof courseAccessSchema>;

// Billing Status Query Schema
export const billingStatusSchema = z.object({
  orderId: z.string().optional(),
  courseId: z.string().uuid("Invalid course ID").optional(),
});

export type BillingStatusRequest = z.infer<typeof billingStatusSchema>;

// Payment Verification Schema
export const paymentVerifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export type PaymentVerifyRequest = z.infer<typeof paymentVerifySchema>;

// Pricing Config
export interface PricingConfig {
  amount: number;
  currency: string;
}
