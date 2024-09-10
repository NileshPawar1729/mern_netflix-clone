import  jwt  from "jsonwebtoken";
import userModel from "../models/user.model.js";
import {ENV_VARS} from "../config/envVar.js"

export async function protectRoute(req,res,next){
    try {
        const token = req.cookies["jwt-netflix"];

        if(!token){
           return res.status(401).json({success:false,message:"Unauthorized-No Token Provided"});
        }

        const decoded = jwt.verify(token,ENV_VARS.JWT_SECRET);

        if(!decoded){
          return res.status(401).json({success:false,message:"Unauthorized-Invalid Token"});
        }

        const user = await userModel.findById(decoded.userId).select("-password");

        if(!user){
            res.status(404).json({success:false,message:"User not found"});
        }
        req.user=user;
        next();

    } catch (error) {
        console.log("Some error in middleware",error.message);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}
