module.exports = function (err,req , res , next){
    res.json({
        "message" : err.message,
        "statusCode" : err.statusCode
    })
}