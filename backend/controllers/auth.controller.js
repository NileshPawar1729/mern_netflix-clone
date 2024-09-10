import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateToke.js';

export async function signup(req, res) {
    let userData = req.body;
    try {
        const { email, password, username } = userData;

        if (!email || !password || !username) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" })
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 charachter" })
        }

        const existingUserByEmail = await userModel.findOne({ email:email })
        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: "Email already exist" })
        }

        const existingUserByUsername = await userModel.findOne({ username: username });

        if (existingUserByUsername) {
            return res.status(400).json({ success: false, message: "username already exist" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);


        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new userModel({
            email: email,
            password: hashPassword,
            username: username,
            image: image
        });

        generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            //Remove password from the response
            res.status(201).json({
                success: true,
                user: {
                    ...newUser._doc,
                    password: ""
                }
            })
        
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }

}

export async function login(req, res) {
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({success:false,message:"All fields are required"});
        }

        const user = await userModel.findOne({email:email})
        if(!user){
            return res.status(400).json({success:false,message:"Invalid Credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({success:false,message:"Invalid Credentials"});
        }

        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            success:true,
            user:{
                ...user._doc,
                password:""
            }
        })

    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({success:false,message:"Internal servver error"});
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie("jwt-netflix");
        res.status(200).json({success:true,message:"Logged Out Successfully"});
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({success:false,message:"Internal servver error"});
    }
}

export async function authCheck(req,res) {
    try {
    
        res.status(200).json({success:true,user:req.user});
    } catch (error) {
      console.log("Error in authCheck controller",error.message);
      res.status(500).json({success:false,message:"Internal Server Error"});    
    }
}