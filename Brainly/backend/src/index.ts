import express from "express";
import dbConnect from "./db/dbconnect";
import { userRouter } from "./routes/user";
import { contentsRouter } from "./routes/contents";
import { LinksRouter } from "./routes/links";
import dotenv from "dotenv";
dotenv.config();
dbConnect();
const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/contents", contentsRouter);
app.use("/api/v1/links", LinksRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000  http://localhost:3000 🚀");
});
