import mongoose from "mongoose";
import { ENV_VARS } from "../config/envVar.js";

export const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(ENV_VARS.MONGO_URI)
        console.log("Connected to mongodb: ",conn.connection.host)
    } catch (error) {
        console.error("Error connecting to mongoDb: "+error.message);
        process.exit(1);
    }
}