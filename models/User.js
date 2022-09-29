import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'
import  Jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Please Provide Name'], minlength: 3, maxlength: 20 , trim:true},
    email: { type: String,
             required: [true, 'Please Provide email'],
             validate:{
             validator:validator.isEmail,
             message:'Please provide valid email'
             },
             unique:true, },
    password: { type: String, required: [true, 'Please Provide password'],minlength:6,select:false },
    lastName: { type: String, minlength: 3, maxlength: 20 , trim:true ,default:'lastName'},
    location: { type: String, minlength: 3, maxlength: 20 , trim:true,default:'my City' }
})

UserSchema.pre('save',async function(){
    // console.log(this.modifiedPaths())
    if(!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})


UserSchema.methods.createJWT=function(){
   // console.log(this)
   return Jwt.sign({userId:this._id},process.env.JWT_SECRET,{
   expiresIn:process.env.JWT_LIFETIME
  
    
})
}

UserSchema.methods.comparePassword=async function(candidatePassword){
const isMatch=await bcrypt.compare(candidatePassword,this.password);
return isMatch
}


export default mongoose.model('User',UserSchema)