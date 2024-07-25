const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')

const getUserDetailsFromToken = async (accessToken) => {
    try {
        console.log('accessToken', accessToken)
        if (!accessToken) {
            return {
                message: "session out",
                logout: true,
            }
        }

        const decode = await jwt.verify(accessToken, process.env.JWT_ACCESS_KEY)

        return await UserModel.findById(decode?.id).select('-password')
    } catch (error) {
        return {
            message: error.message || error,
            logout: true
        }
    }

}

module.exports = getUserDetailsFromToken