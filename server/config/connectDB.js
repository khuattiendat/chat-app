const mongoose = require('mongoose')
require("dotenv").config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI,)
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Something is wrong ", error)
    }
}

module.exports = connectDB