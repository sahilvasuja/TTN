const { default: mongoose } = require("mongoose");
const User = require("./usermodel");

const taskSchema={
 title: {
    type: String,
    required:true
 } ,
completed: {
    type: Boolean,

},
owner: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    require:true
},
assignedTo: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    require:true
}
}

// module.exports = mongoose.model("Task", taskSchema);
const Task=mongoose.model("task", taskSchema)
module.exports=Task