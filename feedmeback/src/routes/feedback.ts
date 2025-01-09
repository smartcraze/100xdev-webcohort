import { Router } from "express";
import { RequestFeedback, SubmitFeedback } from "../controller/feedback";

export const feedbackRouter = Router();

feedbackRouter.post("/", SubmitFeedback);
feedbackRouter.get("/", RequestFeedback);
