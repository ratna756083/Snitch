import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
import redis from "../config/cache.js";
function sendToken(user,res,message,stCode){
    const token=jwt.sign({
        id:user._id
    },config.JWT_SECRET,{
        expiresIn:"7d"
    })
    res.cookie("token",token);

    
    return res.status(stCode).json({
        message,
        success:true,
        user:{
            id:user._id,
            email:user.email,
            fullname:user.fullname,
            contact:user.contact,
            role:user.role

        }
     })
}


export const register=async(req,res)=>{

    const {email,contact,password,fullname,isSeller}=req.body

    try {
       const exsitUser=await userModel.findOne({
        $or:[{email},{contact}]
       }) 

       if(exsitUser){
        return res.status(400).json({
            message:"user already exsist"
        })
       }

     const user=await userModel.create({
        email,
        contact,
        password,
        fullname,
        role:isSeller ? "seller":"buyer"
     })

     await sendToken(user,res,"user created successfully",201)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"server error"
        })
    }

}

export const login=async(req,res)=>{
    const {email,password}=req.body

    const user=await userModel.findOne({
        email
    })

    if(!user){
        return res.status(400).json({
            message:"Invalid creditial"
        })
    }

    const Matchpassword=await user.comparePassword(password)

    if(!Matchpassword){
        return res.status(400).json({
            message:"invalid creditial"
        })
    }

    await sendToken(user,res,"User login successfully",200)
}

export const  googleCallback=async (req,res)=>{
    const {id,displayName,emails,photos}=req.user
    const email=emails[0].value
    const profilePic=photos[0].value 

    let user=await userModel.findOne({email})
    if(!user){
        user=await userModel.create({
            email,
            googleId:id,
            fullname:displayName
        })
    }
    const token=jwt.sign({
        id:user._id
    },config.JWT_SECRET,
    {expiresIn:"7d"})
  res.cookie("token",token)

    res.redirect("https://snitch-6.onrender.com/")
}

export async function getMe(req,res){
    const user=req.user
    res.status(200).json({
        message:"user fetched successfully",
        user:{
            id:user._id,
            email:user.email,
            contact:user.contact,
            fullname:user.fullname,
            role:user.role
        }
    })
}

export const logout=async(req,res)=>{
    const token=req.cookies.token
   

    res.clearCookie("token")
  await  redis.set(token,Date.now().toString(),"EX",60*60)

    res.status(200).json({
        message:"logout successfull"
    })
}

