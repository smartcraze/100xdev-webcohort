import express from "express";
import dbConnect from "./db/db";
import { userRouter } from "./routes/user";
// import { feedbackRouter } from "./routes/feedback";

import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
dbConnect();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);
// app.use("/api/v1/contents", feedbackRouter);

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// For the production
// export default app;
