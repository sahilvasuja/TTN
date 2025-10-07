const Task=require('../models/taskmodel')
const redisClient=require('../config/redis')
const mongoose=require('mongoose')
exports.createTask=async(req,res)=>{
 

     try {
        let assignedTo=req.user._id
           if (req.user.role === "admin" && req.body.assignedTo) {
             if (!mongoose.Types.ObjectId.isValid(req.body.assignedTo)) {
        return res.status(400).json({ error: "Invalid assigned user ID" });
    }
      assignedTo = req.body.assignedTo;
    }

        const task = new Task({
            title: req.body.title,        
            owner: req.user._id,          
            assignedTo: assignedTo 
        })
        await task.save()
         const cacheKey = `tasks:${req.user._id}`;
    const cachedTasks = await redisClient.get(cacheKey);
    if(cachedTasks){
        let tasks=JSON.parse(task)
        await redisClient.setEx(cacheKey,600,JSON.stringify(tasks))
    }
    else{
         await redisClient.setEx(cacheKey,600,JSON.stringify([task]))
    }
        res.json({ message: "Task created successfully", task })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}


exports.getMyTasks = async (req, res) => {
    const cacheKey=`tasks:${req.user._id}`
    const cachedTasks=await redisClient.get(cacheKey)
    if(cachedTasks){
       return res.json(JSON.parse(cachedTasks))
    }
     const tasks = await Task.find({ assignedTo: req.user._id });
        console.log(tasks, 'tasks------')
    try {
        const tasks = await Task.find({ assignedTo: req.user._id }).populate("owner","name email");
        console.log(tasks, 'taskspopulatw------')
        res.json(tasks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.deleteTask=async(req,res)=>{

    try{
        const del=req.params.id
        const task = await Task.findByIdAndDelete(del)
       
        if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully", task });
      
    }
    catch(err){
         res.status(400).json({ error: err.message });
    }
}
exports.getAllTasks = async (req, res) => { 
    
    try {
         const tasks = await Task.find()
        //  .populate("owner", "email");
     .populate("assignedTo", "name email")  
       .populate("owner", "name email");
        console.log(tasks, 'tasksAdmin------')
        res.json(tasks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}