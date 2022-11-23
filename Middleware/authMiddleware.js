const createHttpError = require("http-errors")
const jsonwebtoken = require("jsonwebtoken")

const verifyUserToken = (req , res , next)=> {
    try{
        if(req.headers.authorization == null){
           throw createHttpError(400 , "Unauthorized login") // Headers variable empty
        }else if(!(req.headers.authorization.startsWith("Bearer "))){
            throw createHttpError(400 , "Unauthorized login") // Headers variable bearer not found
        }else{
            const getToken = req.headers.authorization.replace("Bearer " , "") // Bearer token found
            const jwtVerify = jsonwebtoken.verify(getToken , process.env.JWT_SECURE_KEY) // Check token verify
            req.userID = jwtVerify.userID // Jwt verify data add header
            next() // Next middleware working
        }
    }catch(e){
        next(e) // Aaaah.. something went wrong next middleware working
    }
}

const refreshTokenVerify = (req , res , next) =>{
    try{
        if(req.headers.authorization == null){
            throw createHttpError(400 , "Unauthorized login") // Headers variable empty
         }else if(!(req.headers.authorization.startsWith("Bearer "))){
             throw createHttpError(400 , "Unauthorized login") // Headers variable bearer not found
         }else{
            const getRefreshToken = req.headers.authorization.replace("Bearer " , "") // Bearer token found
            const refreshTokenVerify = jsonwebtoken.verify(getRefreshToken , process.env.JWT_REFRESH_KEY) // Check token verify
            if(refreshTokenVerify.isRefreshToken == true){ // This token is refresh token check
                req.userID = refreshTokenVerify.userID  // This token is refresh token
                next() // Next middleware working
            }else{
                throw createHttpError(400 , "Bad request") // This token is not refresh token
            }
         }
    }catch(e){
        next(e) // Aaaah.. something went wrong next middleware working
    }
}

//These functions can be accessed externally
module.exports = {
    verifyUserToken,
    refreshTokenVerify
}