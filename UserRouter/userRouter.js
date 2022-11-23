const express = require("express").Router()
const loginRegisterController = require("../Controller/Login&Register/loginregister")
const userProcessController = require("../Controller/UserProcess/userProcessController")
const authMiddleware = require("../Middleware/authMiddleware")
//User login
express.post("/login", loginRegisterController.login)
//User register
express.post("/register", loginRegisterController.register)
//User password reset
express.post("/password-reset" , authMiddleware.verifyUserToken , userProcessController.resetPassword)
//Refresh token
express.get("/refresh-token", authMiddleware.refreshTokenVerify ,userProcessController.refreshToken)
//User delete
express.delete("/deleteUser" , authMiddleware.verifyUserToken , userProcessController.deleteData)


module.exports = express