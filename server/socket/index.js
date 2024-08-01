const express = require('express')
const {Server} = require('socket.io')
const http = require('http')
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')
const UserModel = require('../models/UserModel')
const {ConversationModel, MessageModel} = require('../models/ConversationModel')
const getConversation = require('../helpers/getConversation')
const {get} = require("mongoose");

const app = express()

/***socket connection */

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})

/***
 * socket running at http://localhost:8080/
 */

//online user
const onlineUser = new Set()

try {
    io.on('connection', async (socket) => {
            console.log("connect User ", socket.id)

            const accessToken = socket.handshake.auth.accessToken || ""

            // user đang đăng nhập
            const user = await getUserDetailsFromToken(accessToken)
            //create a room
            socket.join(user?._id?.toString())
            onlineUser.add(user?._id?.toString())

            io.emit('onlineUser', Array.from(onlineUser))

            socket.on('message-page', async (conversationId) => {

                const conversation = await ConversationModel.findById({
                    _id: conversationId
                }).populate('messages').sort({updatedAt: -1})
                const payload = {
                    _id: conversation?._id,
                    conversationName: conversation?.conversationName,
                    conversationType: conversation?.conversationType,
                    avatar: conversation?.avatar,
                    members: conversation?.members
                }
                socket.emit('message-user', payload)


                //     get previous message

                socket.emit('message', conversation?.messages || [])
            })
            socket.on('message-user-page', async (userId) => {
                const userDetails = await UserModel.findById(userId).select("-password")

                const payload = {
                    _id: userDetails?._id,
                    name: userDetails?.name,
                    email: userDetails?.email,
                    phone: userDetails?.phone,
                    profile_pic: userDetails?.profile_pic,
                    online: onlineUser.has(userId)
                }
                console.log(payload)
                socket.emit('message-user', payload)


                //get previous message
                const getConversationMessage = await ConversationModel.findOne({
                    "$or": [
                        {sender: user?._id, receiver: userId},
                        {sender: userId, receiver: user?._id}
                    ]
                }).populate('messages').sort({updatedAt: -1})

                socket.emit('message', getConversationMessage?.messages || [])

            })

            //test new group
            socket.on('new-group', async (data) => {
                const createConversation = await ConversationModel({
                    avatar: data?.avatar,
                    conversationType: "group",
                    conversationName: data?.conversationName,
                    members: data?.members,
                    sender: data?.sender,
                    receiver: data?.receiver
                })
                const saveConversation = await createConversation.save()

                const conversationData = await getConversation(data?.sender)
                // trả về data của conversation ( lastMsg, sender, receiver)
                socket.emit('conversation', conversationData)

            })

            //new message
            socket.on('new message', async (data) => {
                // console.log("data", data)

                //check conversation is available both user

                let conversation = await ConversationModel.findOne({
                    _id: data.conversationId
                })

                const message = new MessageModel({
                    text: data.text,
                    imageUrl: data.imageUrl,
                    videoUrl: data.videoUrl,
                    msgByUserId: data?.msgByUserId,
                })
                const saveMessage = await message.save()

                const updateConversation = await ConversationModel.updateOne({_id: conversation?._id}, {
                    "$push": {messages: saveMessage?._id}
                })

                const getConversationMessage = await ConversationModel.findOne({
                    _id: data?.conversationId
                }).populate('messages').sort({updatedAt: -1})

                io.emit('message', getConversationMessage?.messages || [])

                const conversationSender = await getConversation(data?.currentUserId)
                io.emit('conversation', conversationSender)

            })


            //sidebar
            socket.on('sidebar', async (currentUserId) => {
                const conversation = await getConversation(currentUserId)
                // trả về data của conversation ( lastMsg, sender, receiver)
                socket.emit('conversation', conversation)
            })
            //

            socket.on('seen', async (msgByUserId) => {

                // lấy toàn bộ message của conversation
                let conversation = await ConversationModel.findOne({
                    "$or": [
                        {sender: user?._id, receiver: msgByUserId},
                        {sender: msgByUserId, receiver: user?._id}
                    ]
                })

                const conversationMessageId = conversation?.messages || []

                // update lại message đã seen
                const updateMessages = await MessageModel.updateMany(
                    {_id: {"$in": conversationMessageId}, msgByUserId: msgByUserId},
                    {"$set": {seen: true}}
                )

                //send conversation
                const conversationSender = await getConversation(user?._id?.toString())
                const conversationReceiver = await getConversation(msgByUserId)

                io.to(user?._id?.toString()).emit('conversation', conversationSender)
                io.to(msgByUserId).emit('conversation', conversationReceiver)
            })

            //disconnect
            socket.on('disconnect', () => {
                onlineUser.delete(user?._id?.toString())
                console.log('disconnect user ', socket.id)
            })
        }
    )

} catch
    (error) {
    console.log("error")

}

module.exports = {
    app,
    server
}

