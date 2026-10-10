import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.routes.js"
import passport from "passport"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import { config } from "./config/config.js"




const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser());
app.use(morgan("dev"));
connectDB();

app.use(passport.initialize())
passport.use(new GoogleStrategy({
    clientID:config.GOOGLE_CLIENT_ID,
    clientSecret:config.GOOGLE_CLIENT_SECRET,
    callbackURL:"http://localhost:3000/api/auth/google/callback"
},(accessToken,refreshToken,profile,done)=>{
    return done(null,profile)
}))


app.use("/api/auth",authRoutes)






export default app;