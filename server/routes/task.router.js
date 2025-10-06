const express=require('express')
const taskController = require('../controllers/task.controller')
const { auth, isVerified } = require('../middleware/auth')
// const auth =require('../middleware/auth')
const router=express.Router()
console.log(taskController, 'task---------')
router.post('/add',isVerified, auth,taskController.createTask )
router.get("/mytasks",isVerified, auth, taskController.getMyTasks);
router.get("/all", auth, taskController.getAllTasks);

module.exports=router