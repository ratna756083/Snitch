import jwt from 'jsonwebtoken'
import {config} from '../config/config.js'
import userModel from '../models/user.model.js'

export const verifySeller=async (req,res,next)=>{
   
    const token=req.cookies.token
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