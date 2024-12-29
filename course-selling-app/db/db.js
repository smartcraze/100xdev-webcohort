const mongoose = require('mongoose')

async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://admin:Born2code%40admin@cohort3.0f0h7.mongodb.net/courseapp");
        console.log("DB connected successfully ⚙️");
    } catch (error) {
        console.log("Error Connecting Db", error);
    }

}

module.exports = { connectDB };