const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")

async function userDetails(request, response) {
    try {
        const accessToken = request.headers.token.split(" ")[1];
        const refreshTOken = request.cookies.refreshToken;
        console.log("refreshTOken", refreshTOken);
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
}

module.exports = userDetails