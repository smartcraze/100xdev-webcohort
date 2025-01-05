import mongoose from "mongoose";

async function dbConnect() {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:Born2code%40admin@cohort3.0f0h7.mongodb.net/brainly"
    );
    console.log("Database connected successfully");
  } catch (error) {
    if (error) {
      console.log("Database connection failed");
      console.log(error);
    }
  }
}

export default dbConnect;
