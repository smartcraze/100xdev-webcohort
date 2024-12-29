const mongoose = require('mongoose')

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected successfully ⚙️");
    } catch (error) {
        console.log("Error Connecting Db", error);
    }

}

module.exports = { connectDB };