const rateLimiter=require('express-rate-limit')
const limit=rateLimiter({
    windowMs: 15*60*1000,
    max:5,
     message: {
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true, 
  legacyHeaders: false,
})

module.exports=limit