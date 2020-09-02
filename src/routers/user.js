const express=require("express")
const router=express.Router()
const User=require('./../db/model/user')
const {checkToken}=require('./../db/middleware/userMiddleware')
const Task = require("../db/model/task")
var multer  = require('multer')

// Get all user
router.get('/users',checkToken,async (req,res)=>{
    const users=await User.find({})
    res.send(users)
})
//Upload avatar
var storage=multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/avatar/');
    },
    filename: function (req, file, cb) {
        console.log("storage")
        console.log(file)
        let fileName=file.originalname
        const startIndex=fileName.search(/\.(jpg|png|jpng)$/)
        const extension=fileName.slice(startIndex)
        cb(null, 'avatar-' + Date.now()+extension)
    }
})
var upload = multer({ 
    storage,
    limits:{
        fileSize:2000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|png|jpng)$/)){
            cb(new Error('Not acceptale extension'))
        }
        cb(null, true)
    }
})
router.post("/user/avatar",checkToken,upload.single('avatar'),async (req,res)=>{
    const fullFileName=req.file.filename
    req.user.user.avatar=fullFileName
    await req.user.save()
    res.status(200).send({"user":req.user})
},(error,req,res,next)=>{
    res.status(400).send({'message':error.message})
})
//Get user by ID
router.get('/user/:id',async (req,res)=>{
    try{
        const user=await User.findOne({_id:req.params.id});
        res.status(201).send(user)
    }
    catch(e){
        res.status(404).send(e)
    }
})
// Register
router.post('/register',async (req,res)=>{
    const validInfor=['user_name','age','password',"email"];
    const requestKey=Object.keys(req.body)
    const isValid=requestKey.every((e)=>validInfor.includes(e))
    
    if(isValid){
        try{
            const newUser = new User({user:req.body});
            const foundUser=await newUser.saveNewUser()
            console.log("newUser",foundUser)
            res.status(200).send(foundUser)
        }
        catch(err){
            res.status(400).send("Lỗi")
        }
    }
    else{
        res.send("Thông tin nhập sai")
    }
    
})
// Delete User
router.delete('/user/me',checkToken,async (req,res)=>{
    try{
        await Task.deleteMany({owner:req.user._id})
        const user=await User.findByIdAndDelete({_id:req.user._id})
        res.send(user)
    }
    catch(e){
        res.send("Error")
    }
})
// Delete All User
router.delete('/users',async (req,res)=>{
    try{
        const allUsersDelete=await User.find({})
        await User.deleteMany({})
        return res.send(allUsersDelete)
    }
    catch(e){
        res.send(e)
    }
})
router.get("/logout",async (req,res)=>{

})
//Login
router.post("/login",async (req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        res.status(200).send(user)
    }
    catch(err){
        res.status(400).send("Loi")
    }
})
module.exports=router