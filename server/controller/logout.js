async function logout(req, res) {
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
}

module.exports = logout