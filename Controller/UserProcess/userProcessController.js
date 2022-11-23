const createHttpError = require("http-errors")
const jsonwebtoken = require("jsonwebtoken")
const user = require("../../MongoDatabase/userSchema")
const mongoose = require("mongoose")

async function deleteUser(req , res , next){
    try{
        if(req.userID == undefined) throw createHttpError(400 , "Bad request") // if userID not found send little error
        user.userDelete(req.userID) // But userID found start this function
        res.status(200).send("User delete") // User deleted successfully
    }catch(e){
        next(e) // Aaaah.. something went wrong next middleware working
    }
}

async function refreshToken(req , res , next){
    try{
        if(req.userID == undefined) throw createHttpError(400 , "Bad request") // if userID not found send little error
        const createAccessToken = await jsonwebtoken.sign({"userID": req.userID }, process.env.JWT_SECURE_KEY , {expiresIn : "1h"}) // User access token refresh
        const createRefreshToken  = await jsonwebtoken.sign({"userID" : req.userID , "isRefreshToken" : true} , process.env.JWT_REFRESH_KEY , { expiresIn: '365d' }) // User refresh token refresh
        
        //Send user tokens
        res.json({
            "accessToken" : createAccessToken,
            "refreshToken": createRefreshToken
        })
    }catch(e){
        next(e) // Aaaah.. something went wrong next middleware working
    }
}


async function resetPassword(req , res , next){
    try{
        if (req.userID == undefined) throw createHttpError(400 , "Bad request") // Userid not found
        if (req.body.password == "" || req.body.password == undefined) throw createHttpError(400 , "Bad request") // User sending password but varible empty
        user.passwordReset(req.userID , req.body.password) // User password not empty, this function working
        res.status(200).send("Password update") // User password reset successfully completed
    }catch(e){
        next(e) // Aaaah.. something went wrong next middleware working
    }
}

//These functions can be accessed externally
module.exports = {
    refreshToken,
    deleteData: deleteUser,
    resetPassword
}