const mongoose=require("./../mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const userSchema=new mongoose.Schema(
    {
        user:{
            email:{
                type:String,
                trim:true,
                unique:true,
                required:true,
                lowercase:true,
                index: true
                
            },
            avatar:{
                type:String,
                lowercase:true,
                default:undefined
            },
            user_name:{
                type:String,
                validate:[(val)=>{return val.length>0},"User name không có"],
                required:[true, 'User_name required'],
            },
            age:{
                type:Number
            },
            password:{
                type:String,
                required:[true, 'always be required'],
                minlength:[6,'Mật khẩu nhiều hơn 6 kí tự']
            }
        },
        tokens:{
            token:{
                type:String
            },
            user_id:{
                type:String
            }
        }
                
            
        
    }
)
userSchema.methods.saveNewUser=async function(){
    
    try{
        const hashPass=await bcrypt.hash(this.user.password,8)
        if(this.modifiedPaths()){
            this.user.password=hashPass
        }
        await this.generateToken()
        this.tokens.user_id=this._id
        await this.save()
        const foundUser=await User.findOne({_id:this._id},{tokens:false})
        return foundUser
    }
    catch(e){
        console.log(e)
        throw new Error("Save error")
    }
    
    
}
userSchema.methods.generateToken=async function(){
    
    
    const token=jwt.sign({id:this._id},process.env.JWT_KEY)
    this.tokens.token=token
    console.log("this",this)
    
    
    
}
userSchema.statics.findByCredentials= async (email,password)=>{
    try{
        const userData =await User.findOne({"user.email":email})
        const isMatch=await bcrypt.compare(password,userData.user.password)
        if(isMatch){
            await userData.generateToken()
            return userData
        }
        throw new Error("Khong dung mat khau")
    }catch(e){
        throw new Error("error")
    }
}
userSchema.virtual('myAllTask',{
    ref:'tasks',
    localField:'_id',
    foreignField:'owner'
})
const User=mongoose.model('users',userSchema)
module.exports=User