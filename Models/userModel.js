const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:true
    },
    password:{
        type:String,
        min:5,
        trim:true,
        required:true
    },
    avatar:{
        type:String
    },
    address:{
        type:String
    }
})

const User = mongoose.model("user",userSchema);


const generateToken = (id)=>{
    return jwt.sign({id},process.env.Secret_key)
}

module.exports={ User,generateToken }