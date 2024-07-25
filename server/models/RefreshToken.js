const mongoose = require('mongoose')
const RefreshSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
    }
}, {
    timestamps: true
})
const RefreshTokenModel = mongoose.model('RefreshToken', RefreshSchema)
module.exports = RefreshTokenModel