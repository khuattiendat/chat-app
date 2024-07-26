const express = require('express')
const checkEmail = require('../controller/checkEmail')
const checkPassword = require('../controller/checkPassword')
const userDetails = require('../controller/userDetails')
const logout = require('../controller/logout')
const updateUserDetails = require('../controller/updateUserDetails')
const searchUser = require('../controller/searchUser')
const AuthController = require('../controller/AuthController')
const MiddlewareLogin = require('../middleware/MiddlewareLogin')

const router = express.Router()

//create user api
router.post('/register', AuthController.register)
//check user email
router.post('/email', checkEmail)
router.get('/test', AuthController.getAll)
//login
router.post('/login', AuthController.login)
//check user password
router.post('/password', checkPassword)
// refresh token
router.post('/refresh-token', AuthController.requestRefreshToken)
//login user details
router.get('/user-details', MiddlewareLogin.verifyToken, userDetails)
//logout user
router.post('/logout', MiddlewareLogin.verifyToken, AuthController.logout)
//update user details
router.post('/update-user', MiddlewareLogin.verifyToken, updateUserDetails)
//search user
router.post("/search-user", searchUser)


module.exports = router