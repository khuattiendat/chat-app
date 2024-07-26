const mongoose = require('mongoose')
require("dotenv").config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log("Connect to DB")
        })

        connection.on('error', (error) => {
            console.log("Something is wrong in mongodb ", error)
        })
    } catch (error) {
        console.log("Something is wrong ", error)
    }
}

module.exports = connectDB