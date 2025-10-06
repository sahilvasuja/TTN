const cluster=require('cluster')
const os=require('os')
const app=require('./app')
const Port = process.env.PORT || 5500;
console.log("Detected CPUs:", os.cpus().length);
const isPrimary = cluster.isPrimary ?? cluster.isMaster;
if(isPrimary){
    const cpuCount =os.cpus().length
    console.log(`Master ${process.pid} is running`);
    console.log(`Starting ${cpuCount} workers...`);
    for(let i=0;i<cpuCount;i++){
        cluster.fork()
    }
 
    cluster.on("exit",(worker,code,signal)=>{
        console.log(`worker ${worker.process.pid} died. Starting newOne`)
        cluster.fork()    
    })
}
else{
  app.listen(Port,'0.0.0.0',()=>{
     console.log(`Worker Port running on ${process.pid} Server running on Port ${Port}`)
 })  
}

