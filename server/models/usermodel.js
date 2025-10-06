
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    
    role: {
        type: String,
        enum: ['admin', 'user'],  
        default: 'user'           
    },
    password:{
        type:String,
        required:true
    }, 
    Token: [
           {
             token: {
                type: String
            }
           }
        ]     
    
})
userSchema.pre("save",async function(next){
    const user=this
    if(user.isModified('password')){
       user.password=await bcrypt.hash(user.password,8)
    }
    next()
})

const User=mongoose.model("user", userSchema)
module.exports=User