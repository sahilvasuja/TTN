const jwt=require('jsonwebtoken')
const User =require('../models/usermodel')
exports.auth=async(req,res,next)=>{
    console.log( req.header('Authorization'))
    // const authHeader = req.header("Authorization");
    
      const authHeader = req.header('Authorization');
        console.log(authHeader, 'authheaderrrrrrrrrrrrrrrr')
    if (!authHeader) {
      return res.status(401).json({ error: req.header });
    }
      const token =authHeader.replace("Bearer", "").trim()
   
      const decoded=jwt.verify(token, process.env.JWT_SECRET)
      console.log(req,token, 'auth')
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
    
   console.log(req, 'isverified')
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