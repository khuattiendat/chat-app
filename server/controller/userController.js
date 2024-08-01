const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const userController = {
    getUserById: async (request, response) => {
        try {
            const accessToken = request.headers.token.split(" ")[1];
            const user = await getUserDetailsFromToken(accessToken)
            return response.status(200).json({
                message: "user details",
                data: user
            })
        } catch (error) {
            return response.status(500).json({
                message: error.message || error,
                error: true
            })
        }
    },
    updateUser: async (request, response) => {
        try {
            const token = request.headers.token.split(" ")[1] || ""

            const user = await getUserDetailsFromToken(token)

            const {name, profile_pic, phone} = request.body

            const updateUser = await UserModel.updateOne({_id: user._id}, {
                name,
                profile_pic,
                phone
            })

            const userInformation = await UserModel.findById(user._id)

            return response.json({
                message: "user update successfully",
                data: userInformation,
                success: true
            })


        } catch (error) {
            return response.status(500).json({
                message: error.message || error,
                error: true
            })
        }
    },
    searchUser: async (request, response) => {
        try {
            const {search, userId} = request.body

            const query = new RegExp(search, "i", "g")
            console.log('query', query)

            const user = await UserModel.find({
                "$or": [
                    {name: query},
                    {email: query},
                    {phone: query}
                ],
                "$and": [
                    {_id: {$ne: userId}}
                ]
            }).select("-password")

            return response.json({
                message: 'all user',
                data: user,
                success: true
            })
        } catch (error) {
            return response.status(500).json({
                message: error.message || error,
                error: true
            })
        }
    }

}
module.exports = userController