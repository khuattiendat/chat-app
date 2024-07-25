const jwt = require('jsonwebtoken');
require('dotenv').config();
const middlewareLogin = {
    verifyToken: async (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            // token có dạng token: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiYWRtaW4iOmZhbHNlLCJpYXQiOjE2ODc3MTM2MzYsImV4cCI6MTcxOTI0OTYzNn0.j9WfXV4w4kWxRtJj-irCPaGxr1idffibZuVPnzrILVU
            const accessToken = token?.split(" ")[1];
            // const accessToken = "";
            // xác minh cái cookies đấy nêú đúng thì cho đi tiếp
            const key = process.env.JWT_ACCESS_KEY
            jwt.verify(accessToken, key, (err, user) => {
                if (err) {
                    return res.status(403).json({
                        error: true,
                        message: "Token is not valid"
                    });
                }
                req.user = user;
                return next();
            });
        } else {
            return res.status(401).json(
                {
                    error: true,
                    message: "You are not authenticated!"
                }
            );
        }
    }
}
module.exports = middlewareLogin;