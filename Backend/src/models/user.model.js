import mongoose from 'mongoose'
import bcrypt from "bcryptjs"
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    contact:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:["buyer","seller"],
        default:"buyer"
    }

})

userSchema.pre("save",async function(password){
    if(!this.isModified("password")) return;
    const hash=await bcrypt.hash(this.password,10);
    this.password=hash;
})

userSchema.methods.comparePassword=async function(password){
  return bcrypt.compare(password,this.password)
}

const userModel=mongoose.model("user",userSchema);
export default userModel