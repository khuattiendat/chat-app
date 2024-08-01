const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        default: ""
    },
    videoUrl: {
        type: String,
        default: ""
    },
    seen: {
        type: Boolean,
        default: false
    },
    msgByUserId: {
        userId: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'User'
        },
        name: {
            type: String,
            required: true
        },
    }
}, {
    timestamps: true
})

const conversationSchema = new mongoose.Schema({
    avatar: {
        type: String,
        default: ""
    },
    conversationType: {
        type: String,
        required: true,
        enum: ['private', 'group']
    },
    conversationName: {
        type: String,
        default: ""
    },
    members: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    sender: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    receiver: [
        {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'User'
        }
    ],
    messages: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Message'
        }
    ]
}, {
    timestamps: true
})

const MessageModel = mongoose.model('Message', messageSchema)
const ConversationModel = mongoose.model('Conversation', conversationSchema)

module.exports = {
    MessageModel,
    ConversationModel
}