const mongoose=require('./../mongoose')
const taskSchema=new mongoose.Schema({
    task_name:{
        type:String,
        required:true
    },
    task_content:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        required:true,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"users"
    }
},{
    timestamps:true
})
taskSchema.methods.saveNewTask=async function(){
    try{
        await this.save()
        const task=await Task.findById(this._id);
        await task.populate('owner','-tokens -password').execPopulate()
        return task
    }
    catch(e){
        throw new Error("Co loi xay ra khi luu")
    }
    
}
const Task=mongoose.model('tasks',taskSchema)


module.exports=Task