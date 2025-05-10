const express=require("express")
const mongoose=require("mongoose")
const userRoutes = require('./routes/userRoutes');
const rideRoutes = require('./routes/rideRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { errorHandler } = require('./middlewares/errorHandler');
const { corsOptions } = require('./middlewares/cors');
const { limiter } = require('./middlewares/rateLimiter');
require('dotenv').config();
const app=express()
app.use(express.urlencoded({limit:"40kb",extended: true}))
app.use(express.json());
app.use(corsOptions);
app.use(limiter);
app.use(errorHandler);
app.listen(3000,()=>{
    console.log("server is running on port 3000")
})
app.get("/",(req,res)=>{
    res.send("Hello")
})

async function main() { 
    const connectiondb=await mongoose.connect("mongodb+srv://Hopin:TNkLoEO9CEJ7IShE@hopin.tebf5.mongodb.net/")
    console.log(`MONGO connected to: ${connectiondb.connection.host}`)
}
main()
app.use('/users',userRoutes);
app.use('/rides', rideRoutes);
app.use('/bookings', bookingRoutes);
