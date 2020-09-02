const express=require("express")
const {checkToken}=require("./../db/middleware/userMiddleware")
const Task=require("./../db/model/task")
const User=require("./../db/model/user")
const router=express.Router()
router.post('/task',checkToken,async (req,res)=>{
    try{
        const newTask=new Task({...req.body,owner:req.user._id})
        res.status(200).send(await newTask.saveNewTask())
    }catch(e){
        res.status(400).send("error")
    }
})
router.get('/tasks',checkToken,async (req,res)=>{
    try{
        const match={}
        const [orderBy,orderDir]=req.query.sort.split(":")
        console.log([orderBy,orderDir])
        if(req.query.isCompleted){
            match.completed=req.query.isCompleted==='true'
        }
        await req.user.populate(
            {path:'myAllTask',
            match,
            options: { 
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort:{
                    [orderBy]:orderDir==='asc'?1:-1
                }
            }}
        ).execPopulate()
        
        res.send({id:req.user._id,tasks:req.user.myAllTask})
        
    }catch(e){
        res.status(400).send("error")
    }
})
module.exports=router