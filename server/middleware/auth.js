const jwt=require('jsonwebtoken')
const User =require('../models/usermodel')
exports.auth=async(req,res,next)=>{
      const token =req.header('Authorization').replace("Bearer", "").trim()
   
      const decoded=jwt.verify(token, process.env.JWT_SECRET)
      console.log(req, 'auth')
   try{
    
    const token =req.header('Authorization').replace("Bearer", "").trim()
   
    const decoded=jwt.verify(token, process.env.JWT_SECRET)
    const user =await User.findOne({ _id: decoded.id })
    if(!user){
        throw new Error()
    }
    req.user=user
    next()
   }
   catch(err){
      res.status(401).json({ error: "Please authenticate" });
   }
}

exports.isVerified=(req,res,next)=>{
   
    if(!req.user){
        return res.status(404).json({message: "Access denied"})
    }
    next()
}

exports.isAdmin=async(req,res,next)=>{
    console.log(req.user, '------------')
    if(req.user.role!='admin'){
         return res.status(403).json({ error: "Access denied, Admin only" });
    }
    next()
}