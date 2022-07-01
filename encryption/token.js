const jwt = require('jsonwebtoken')
const dotenv = require("dotenv");
dotenv.config();

exports.signToken = (userId) => {
    return jwt.sign({userId: userId},
    process.env.SECRET_TOKEN,
    {expiresIn: process.env.TOKEN_EXPIRED})
}