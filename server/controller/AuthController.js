const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RefreshTokenModel = require("../models/RefreshToken");
const {raw} = require("express");
const AuthController = {
    generateAccessToken: (id) => {
        return jwt.sign(
            {
                id: id,
            },
            process.env.JWT_ACCESS_KEY,
            {expiresIn: "10m"}
        );
    },
    generateRefreshToken: (id) => {
        return jwt.sign(
            {
                id: id
            },
            process.env.JWT_REFRESH_KEY,
            {expiresIn: "365d"}
        );
    },
    register: async (req, res) => {
        try {
            const {name, email, password, profile_pic} = req.body

            const checkEmail = await UserModel.findOne({email}) //{ name,email}  // null

            if (checkEmail) {
                return res.status(400).json({
                    message: "Already user exits",
                    error: true,
                })
            }

            //password into hashpassword
            const salt = await bcryptjs.genSalt(10)
            const hashPassword = await bcryptjs.hash(password, salt)

            const payload = {
                name,
                email,
                profile_pic,
                password: hashPassword
            }

            const user = new UserModel(payload)
            const userSave = await user.save()

            return res.status(201).json({
                message: "User created successfully",
                data: userSave,
                success: true
            })

        } catch (error) {
            return res.status(500).json({
                message: error.message || error,
                error: true
            })
        }
    },
    login: async (req, res) => {
        try {
            const {email, password} = req.body

            const user = await UserModel.findOne({email});

            if (!user) {
                return res.status(400).json({
                    message: "user not exit",
                    error: true
                })
            }
            //
            const verifyPassword = await bcryptjs.compare(password, user.password)

            if (!verifyPassword) {
                return res.status(400).json({
                    message: "Please check password",
                    error: true
                })
            }
            const userId = user?._id
            const accessToken = await AuthController.generateAccessToken(userId)
            const refreshToken = await AuthController.generateRefreshToken(userId)
            const payload = {
                user_id: userId,
                token: refreshToken
            }
            const refreshModel = new RefreshTokenModel(payload)
            await refreshModel.save()
            await res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
            });
            res.status(200).json({
                message: "Login successfully",
                accessToken: accessToken,
                success: true
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message || error,
                error: true
            })
        }
    },
    requestRefreshToken: async (req, res) => {
        //Take refresh token from user
        const refreshToken = req.cookies.refreshToken;
        console.log("refreshToken!!!!", refreshToken)
        //Send error if token is not valid
        if (!refreshToken) return res.status(401).json("You're not authenticated");
        const refreshTokens = await RefreshTokenModel.find({
            token: refreshToken,
        });
        if (!refreshTokens) {
            return res.status(403).json("Refresh token is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
            if (err) {
                console.log(err);
            }
            //create new access token, refresh token and send to user
            const newAccessToken = AuthController.generateAccessToken(user?.id);
            const newRefreshToken = AuthController.generateRefreshToken(user?.id);
            await RefreshTokenModel.findOneAndUpdate({
                token: refreshToken,
            }, {
                token: newRefreshToken,
            })
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
            });
            res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        });
    },
    logout: async (req, res) => {
        try {
            res.clearCookie("refreshToken")
            res.status(200).json({
                error: false,
                message: "Logged out successfully!"
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message || error,
                error: true
            })
        }
    },
    //
    getAll: async (req, res) => {
        try {
            const user = await UserModel.find().select("-password")
            return res.json({
                message: "All user",
                data: user,
                success: true
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message || error,
                error: true
            })
        }
    }
}
module.exports = AuthController