const express = require('express')
const AuthController = require('../controller/AuthController')
const userController = require('../controller/userController')
const MiddlewareLogin = require('../middleware/MiddlewareLogin')
const ConversationController = require('../controller/ConversationController')

const router = express.Router()

//create user api
router.post('/register', AuthController.register)
// test
router.get('/test', AuthController.getAll)
//login
router.post('/login', AuthController.login)
// refresh token
router.post('/refresh-token', AuthController.requestRefreshToken)
//get user details
router.get('/user-details', MiddlewareLogin.verifyToken, userController.getUserById)
//logout user
router.post('/logout', MiddlewareLogin.verifyToken, AuthController.logout)
//update user details
router.post('/update-user', MiddlewareLogin.verifyToken, userController.updateUser)
//search user
router.post("/search-user", MiddlewareLogin.verifyToken, userController.searchUser)
//get conversation by id
router.get("/conversation/:id", MiddlewareLogin.verifyToken, ConversationController.getConversationById)


module.exports = router