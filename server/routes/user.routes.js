const express=require('express')
const router=express.Router()
const userController  = require('../controllers/user.controller')
const loginLimiter=require('../middleware/rateLimiter')
const { auth } = require('../middleware/auth')

router.post("/signup", userController?.createUser)
router.post("/login",loginLimiter, userController?.loginUser)
router.post("/logout", userController?.logout)
router.get("/allUser", userController?.allUser)
router.post("/logoutAll", userController?.logout)

// router.get('google',)
module.exports=router