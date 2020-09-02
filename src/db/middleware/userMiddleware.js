const jwt=require("jsonwebtoken")
const User=require('./../model/user');

async function checkToken(req,res,next){
    const token=req.header('authorization')
    try{
        const jwtInstance=await jwt.verify(token,process.env.JWT_KEY)
        const userID=jwtInstance.id;
        const userOwn=await User.findOne({"_id":userID})
        req.user=userOwn
        delete req.user.password;
        delete req.user.tokens
        next()
        
    }
    catch(e){
        res.status(400).send("err");
    }
    
    
}
module.exports={checkToken}