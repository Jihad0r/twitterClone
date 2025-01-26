import mongoose from "mongoose";

export const connectDB = async ()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_DB)
        console.log("connected",connect.connection.host)
    }catch(error){
        process.exit(1)
    }
    
}