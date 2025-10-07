require("dotenv").config(); 

const express =require('express')
const app=express()
const helmet = require('helmet');
const redisClient=require('./config/redis')
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");


const options= {
  definition: {
    openapi: "3.0.0",
    info:{
      title: "FullStack",
      version: "1.0.0",
      description: "Api documentation"
    },
     components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
    servers: [
      {
        url:  "http://localhost:5500",
      }
    ]
  },
  apis: ["./routes/*.js"]
}
const specs=swaggerJsdoc(options)
app.use('/api/docs',swaggerUi.serve,swaggerUi.setup(specs))
const mongoose=require('mongoose')

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB (FullStack)"))
.catch(err => console.error(" Connection error:", err));

const cors=require('cors')
const Port=process.env.PORT || 5500
app.use(express.json())
app.use(helmet());
const userRouter=require('./routes/user.routes')
const taskRouter=require('./routes/task.router');
const { version } = require("os");
// app.use(cors())
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ add Authorization here
  })
);
app.get('/', (req,res)=>{
    const data=req.body
    res.json(data)
})




app.get('/health', async(req,res)=>{
  let mongoStatus='down'
  let redisStatus='down'
  if(mongoose.connection.readyState==1){
    mongoStatus='up'
  }
  try{
    await redisClient.ping()
    redisStatus='up'
  }
  catch(err){
    redisStatus='down'
  }

  res.status(200).json({
    status:"ok",
    serverTime: new Date(),
    services: {mongoDb:mongoStatus,redis: redisStatus},
    message: 'server is running'
  })
})
app.use('/user',userRouter)
app.use('/task',taskRouter )


// app.listen(Port,()=>{
//     console.log(`Server running on Port ${Port}`)
// })


module.exports = app;