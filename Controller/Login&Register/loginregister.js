const bcrpty = require("bcrypt")
const createHttpError = require("http-errors")
const { User,logIn } = require("../../MongoDatabase/userSchema")
const jsonwebtoken = require("jsonwebtoken")


//User register function
async function register(req , res , next){
    try{   
        const searchUser = await User.findOne({email : req.body.email}) // Check user email
        if(searchUser){
            throw createHttpError(400 , "This email alredy exists") // Emasil already exits
        }

        // Create json model
        const createUserModel = {
            "username" : req.body.username,
            "email" : req.body.email,
            "password" : await bcrpty.hash(req.body.password , 10)
            }
            const addUser = new User(createUserModel) // Created json model add database
            await addUser.save() // Json data has been database
            res.status(200).json({"message" : "User has been created"}) // Send user a message
    }catch(e){
        next(e) // Aaaah.. something went wrong next middleware working
    }
}


//User login
async function login(req , res , next){
    try{
        const getUser = await logIn(req.body.email , req.body.password) // Sending data login function

        //Get user variable not null create Token and refresh Token processes work
        const createToken = await jsonwebtoken.sign({"userID" : getUser._id} , `${process.env.JWT_SECURE_KEY}` , {expiresIn : "1h"})
        const refreshToken  = await jsonwebtoken.sign({"userID" : getUser._id , "isRefreshToken" : true} , process.env.JWT_REFRESH_KEY , {expiresIn: '365d' })
        
        //Generate Token and send Token to user
        res.json({
            "authToken" : createToken,
            refreshToken
        })
    }catch(e){
        next(e) // Aaaah.. something went wrong next middleware working
    }
}


//These functions can be accessed externally
module.exports = {
    register,
    login
}