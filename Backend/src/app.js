import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js"
import passport from "passport"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import { config } from "./config/config.js"
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'




const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser());
app.use(morgan("dev"));

app.use(passport.initialize())
passport.use(new GoogleStrategy({
    clientID:config.GOOGLE_CLIENT_ID,
    clientSecret:config.GOOGLE_CLIENT_SECRET,
    callbackURL:"https://snitch-5-t80s.onrender.com/api/auth/google/callback"
},(accessToken,refreshToken,profile,done)=>{
    return done(null,profile)
}))


app.use("/api/auth",authRoutes)
app.use("/api/products",productRoutes)
app.use("/api/cart",cartRoutes)






export default app;