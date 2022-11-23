//Express
const express = require("express")
const app = express()
// Routers
const userMiddleware = require("./UserRouter/userRouter")
const errorMiddleware = require("./Middleware/errorMiddleware")
//Read .env file
const dotenv = require("dotenv")
dotenv.config()
//Mongodb
require("./MongoDatabase/mongoDatabase")

// Reading json and form data add settings add
app.use(express.json())
app.use(express.urlencoded({extended : true}))

//User middleware
app.use("/user", userMiddleware)
//Error middleware
app.use(errorMiddleware)
// Server port
app.listen(process.env.PORT)