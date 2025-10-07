const User=require('../models/usermodel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const { validateResigter } = require('../userValidation');
exports.createUser=async(req,res)=>{
      const { error } = validateResigter(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
    const {name,email,password}=req.body

    const user=await User.findOne({email})
    if(user){
        res.status(401).json('user already exist')
    }
    try{
        const signup=new User(req.body)
        await signup.save()
        console.log(signup, '---signup')
          res.json(signup)
    }
    catch(err){
        res.json({error:err.message})
    }
}


exports.logout=async(req,res)=>{
    try{
        console.log(req, '------->')
// res.json(req.user, 'logout')
        req.user.Token=req.user.Token.filter((t)=>t.token!=req.token)
        await req.user.save()
        res.json({ message: "Logout successful" });
        // console.log(req.body, '------->')
        // res.json(res.body)
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.logoutAll=async(req,res)=>{
    try{
        req.user.Token=[]
      await  req.user.Token.save()
       res.json({ message: "Logout from all devices successful" });
    }
      catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.loginUser=async(req,res)=>{
    const {name,email,password}=req.body
    const user=await User.findOne({email})
    console.log(user, 'role------')
    if(!user){
        res.status(401).json('user not exist')
    }
    try{
          const isMatch = await bcrypt.compare(req.body.password, user.password);
         if(!isMatch){
              res.status(400).json({error:"password doen't match"})
        }
        
        const token=jwt.sign({id:user._id, email: user.email, role: user.role}, process.env.JWT_SECRET)
         user.Token.push({ token });
        await user.save()
        const {email,Token,role, name}= user
        res.json({message: "Login Successfull", data:{email, Token ,role, name}})
    }
    catch(err){
        res.json({error:err.message})
    }
}


exports.allUser=async(req,res)=>{
    const user=await User.find()
    console.log(user, 'role------')
    
    try{
     res.json({message: "List of All Users", user})
    }
    catch(err){
        res.json({error:err.message})
    }
}