import jwt from 'jsonwebtoken'
import {config} from '../config/config.js'
import userModel from '../models/user.model.js'
import redis from '../config/cache.js'

export const verifyUser=async (req,res,next)=>{
    const token=req.cookies.token
    
    if(!token){
        return res.status(401).json({
            message:"unauthorised"
        })
    }
   const isBlackListed= await redis.get(token)
   if(isBlackListed){
    return res.status(400).json({
        message:"invalid creditial"
    })
   }

   try {
     const decode=jwt.verify(token,config.JWT_SECRET)

    const user=await userModel.findById(decode.id)
   
    if(!user){
         return res.status(401).json({
            message:"unauthorised"
        })
    }
   req.user=user
   next()
    
   } catch (error) {
    console.log(error)

    return res.status(401).json({
        message:"unauthorised"
    })
   }

}



export const verifySeller=async (req,res,next)=>{
    
   
    const token=req.cookies.token
    console.log(token)
    if(!token){
        return res.status(401).json({
            message:"unauthorised"
        })
    }

    try {
        const decode=jwt.verify(token,config.JWT_SECRET)
        const user=await userModel.findById(decode.id)

        if(!user){
            return res.status(401).json({
            message:"unauthorised"
        })
        }

        if(user.role !== "seller"){
            return res.status(403).json({message:"Forbidden"})
        }

        req.user=user
        next()

    } catch (error) {
        console.log(error)
         return res.status(401).json({
            message:"unauthorised"
         })
    }
}
