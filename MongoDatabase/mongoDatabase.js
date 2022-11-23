// This file check mongoDB connection

const mongoDb = require("mongoose")
const connection = mongoDb.connect(process.env.MONGODB_URL)
connection
    .then((value) => console.log("Database connect"))
    .catch(console.log("database not connect"))
