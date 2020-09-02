const express=require("express")
const app=express()
const path=require("path")
const User=require('./src/db/model/user')
//Config
app.use(express.json())
app.use(express.static('public/'))

//Set up main path 
const publicPath=path.join(__dirname,'public')
const PORT=process.env.PORT
 
// Set up Router
const userRouter=require("./src/routers/user")
const taskRouter=require('./src/routers/task')
app.use(userRouter)
app.use(taskRouter)
// async function test(){
//     const user=await User.findOne({_id:"5f4de24e4f9d3c30a8f35474"})
    
//     user.user.avatar="123.jpg"
//     await user.save()
//     console.log(user)
// }
// test()

app.listen(PORT,()=>{
    console.log("server running ",PORT)
})