const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const { nextTick } = require("process");
const { Schema } = mongoose;
const bcrpty = require("bcrypt");
const { create } = require("domain");

const userSchema = new Schema({
    username: {
        type : String,
        required : true,
        trim : true,
        unique : true,
        minLenght : 3,
        maxLength : 50
    },
    email : {
        type : String,
        required : true,
        trim : true,
        lowercase:true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
        trim : true
    }
} ,  {collection : "user" , timestamps : true})


async function logIn(email , password){
    const user = await User.findOne({email}) // Find user in database
    if(!user){
        throw createHttpError(400 , "User email or password wrong") // User not found
    }

    const checkPassword = await bcrpty.compare(password , user.password) // Found user check password
    if(!checkPassword){
        throw createHttpError(400 , "User email or password wrong") // User password wrong
    }
    return user // User found and password same, return user
}

async function register(username , email , password){
    try{

        const createUserModel = {
            "username" : username,
            "email" : email,
            "password" : password
        }
        const createUser = await User(createUserModel)
        createUser.save()
    }catch(e){
        throw Error(e)
    }
}

async function passwordReset(userID , userPassword){
    try{

        const findUser = await User.findOne({_id : userID}) // Find user in databasee
        if(!findUser){
            throw createHttpError(404 , "User not found") // User not found
        }

        await findUser.updateOne({password : await bcrpty.hash(userPassword , 10) }) // User found and update password 
    }catch(e){
        throw Error(e)
    }
}

async function userDelete(userID){
    try{
        const findUser = await User.findOneAndDelete({_id : userID}) // Find user, delete if found, throw error if not found
        if(!findUser){
            throw createHttpError(404 , "User not found") // User not found throw litte error
        }
    }catch(e){
        throw Error(e)
    }
}

const User = mongoose.model("user" , userSchema)


//These functions can be accessed externally
module.exports = {
    User,
    logIn,
    register,
    passwordReset,
    userDelete
}