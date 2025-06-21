const { oauth2 } = require("googleapis/build/src/apis/oauth2");
const userModel = require("../models/userModels");
const { oauth2Client } = require("../utils/googleConfig");
const jwt = require("jsonwebtoken");
const axios = require("axios");


const googleLoing = async (req, res) => {
    try {
        const { code } = req.query;
        // console.log("Google login code:", code);
        const googelRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googelRes.tokens);

        // const userInfo = await oauth2.userinfo.get();
        const userInfo = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${googelRes.tokens.access_token}`,

        );
        console.log("User info from Google:", userInfo.data);
        const { email, name, picture } = userInfo.data;
        // console.log("User email:", email);
        // let user = await userModel.findOne({ email });
        // if (!user) {
        //     user = await userModel.create({
        //         username: name,
        //         email,
        //         Image: picture
        //     });
        // }
        // const { _id } = user;
        // const token = jwt.sign({ _id, email },
        //     process.env.JWT_SECRET,
        //     { expiresIn: process.env.JWT_EXPIRY || '1d' }
        // );
        // console.log("Generated JWT token:", token);

        // return res.status(200).json({
        //     message: "Login successful",
        //     token,
        //     user: {
        //         _id,
        //         username: user.username,
        //         email: user.email,
        //         Image: user.Image
        //     }
        // })
        res.status(200).json({ message: "Code Run" });


    } catch (error) {
        console.error("Error in googleLogin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    googleLoing
}