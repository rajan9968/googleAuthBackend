const { google } = require("googleapis")
const userModel = require("../models/userModels")
const { oauth2Client } = require("../utils/googleConfig")
const jwt = require("jsonwebtoken")

const googleLogin = async (req, res) => {
    try {
        const { code } = req.query

        if (!code) {
            return res.status(400).json({
                message: "Authorization code is required",
                error: "missing_code",
            })
        }

        console.log("Google login code received:", code.substring(0, 20) + "...")
        console.log("Redirect URI being used:", process.env.GOOGLE_REDIRECT_URI)
        console.log("Client ID:", process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + "...")

        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code)
        console.log("Tokens received successfully")

        // Set credentials
        oauth2Client.setCredentials(tokens)

        // Get user info using the Google API client
        const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client })
        const userInfoResponse = await oauth2.userinfo.get()
        const userInfo = userInfoResponse.data

        console.log("User info from Google:", {
            email: userInfo.email,
            name: userInfo.name,
            id: userInfo.id,
        })

        const { email, name, picture } = userInfo

        if (!email) {
            return res.status(400).json({
                message: "Email not provided by Google",
                error: "missing_email",
            })
        }

        // Find or create user
        let user = await userModel.findOne({ email })
        if (!user) {
            user = await userModel.create({
                username: name,
                email,
                Image: picture,
                googleId: userInfo.id,
            })
            console.log("New user created:", user._id)
        } else {
            console.log("Existing user found:", user._id)
        }

        // Generate JWT token
        const { _id } = user
        const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || "1d" })

        console.log("JWT token generated successfully")

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id,
                username: user.username,
                email: user.email,
                Image: user.Image,
            },
        })
    } catch (error) {
        console.error("Error during Google login:", {
            message: error.message,
            code: error.code,
            details: error.response?.data || error.details,
        })

        // Handle specific Google OAuth errors
        if (error.code === "invalid_grant") {
            return res.status(400).json({
                message: "Authorization code is invalid or expired. Please try logging in again.",
                error: "invalid_grant",
                suggestion: "The authorization code may have expired or been used already. Please restart the login process.",
            })
        }

        if (error.code === "redirect_uri_mismatch") {
            return res.status(400).json({
                message: "Redirect URI mismatch",
                error: "redirect_uri_mismatch",
                suggestion: "Check that your redirect URI in Google Console matches exactly with your backend configuration.",
            })
        }

        return res.status(500).json({
            message: "Internal server error during Google authentication",
            error: error.message,
            code: error.code,
        })
    }
}

// Helper function to initiate Google OAuth
const initiateGoogleAuth = (req, res) => {
    try {
        const { getAuthUrl } = require("../utils/googleConfig")
        const authUrl = getAuthUrl()

        return res.status(200).json({
            message: "Google auth URL generated",
            authUrl,
        })
    } catch (error) {
        console.error("Error generating auth URL:", error)
        return res.status(500).json({
            message: "Error generating authentication URL",
            error: error.message,
        })
    }
}

module.exports = {
    googleLogin,
    initiateGoogleAuth,
}
