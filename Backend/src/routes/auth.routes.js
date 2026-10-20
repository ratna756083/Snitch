import express from "express"
import {validateRegisterUser,validateLoginUser} from "../validator/auth.validator.js"
import {register,login, googleCallback,getMe,logout} from "../controllers/auth.controller.js"
import {verifyUser} from "../middlewares/auth.middleware.js"
import passport from "passport"
const router=express.Router()




router.post("/register",validateRegisterUser,register)
router.post("/login",validateLoginUser,login)
router.get("/google",passport.authenticate("google",{scope:["profile","email"]}))
router.get("/google/callback",
    passport.authenticate("google", {
        session:false,
        failureRedirect:"https://snitch-5-t80s.onrender.com/login"
    }),
        googleCallback
    )


    router.get("/get-me",verifyUser,getMe)
    router.delete("/logout",verifyUser,logout)

export default router