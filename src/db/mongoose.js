const mongoose=require("mongoose")
const dbURL=process.env.MONGODB_URL
mongoose.connect(
    dbURL,
    {
        useUnifiedTopology: true,
        useNewUrlParser:true,
        useCreateIndex: true
    })

module.exports=mongoose

