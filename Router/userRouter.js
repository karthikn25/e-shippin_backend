const express = require('express');
const { User, generateToken } = require('../Models/userModel.js');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');



const upload = multer({storage:multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,path.join(__dirname,'..','uploads/user'))
  },
  filename:function(req,file,cb){
    cb(null,file.originalname)
  }
})})


const router = express.Router();




// signup code
router.post('/signup',async(req,res)=>{
    try {
      let user = await User.findOne({email:req.body.email});
      if(user){
        res.status(400).json({message:'User Already Exists Please Login'})
      }   
      if(!req.body.name || !req.body.email || !req.body.password){
        res.status(400).json({message:"All credentials are Required"})
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password,salt);
      
      user = await new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
      }).save()

      const token = generateToken(user._id);

      res.status(200).json({message:"Signup Successfully",token,user})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
})

// login code

router.post('/login',async(req,res)=>{
  try {
    let user = await User.findOne({email:req.body.email})
    if(!user){
      res.status(400).json({message:"User doesn't exists"})
    }
    if(!req.body.email || !req.body.password){
      res.status(400).json({message:"All credentials are Required"})
    }
    const token = generateToken(user._id);
    const verify = await bcrypt.compare(user.password,token);
    res.status(200).json({message:"Login successfully",user,token})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal Server Error"})
  }
})

// forgetpassword code

router.post("/forget-password",async(req,res)=>{
  try {
    let user = await User.findOne({email:req.body.email})
    if(!user){
      res.status(400).json({message:"User doesn't exists"})
    }
    if(!req.body.email){
      res.status(400).json({message:"Email Required"})
    }
    const secret = user.password + process.env.Secret_key;
    const token =  jwt.sign({_id:user._id,email:user.email},secret,{
      expiresIn:"5m",
    });
    // console.log(token);
    const link = `http://localhost:3000/reset/${user._id}/${token}`;
    // console.log(link)
    let transporter = nodemailer.createTransport({
      service:'gmail',
      secure:false,
      auth:{
        user: process.env.Mail,
        pass: process.env.Mail_Password,
      }
    })
    let details = {
      from: process.env.USER, // sender address
      to: req.body.email, // list of receivers
      subject: "Reset-Password", // Subject line
      text: link,
    };

    transporter.sendMail(details, (err) => {
      if (err) {
        console.log("error", err);
      } else {
        console.log("email sent");
      }
    });
    res.json(link);
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal Server Error"})
  }
})

//reset code
router.put("/reset-password/:id/:token",async(req,res)=>{
  const { token } = req.params;
    const { password } = req.body;
  try {
    
    
    const userdata = await User.findOne({_id:req.params.id});
    console.log(token);
    if(!userdata){
      res.status(400).json({message:"User doesn't Exists"})
    }
    const secret = userdata.password + process.env.Secret_key;

    const verify = jwt.verify(token,secret);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const user = await User.findOneAndUpdate(
      {
      _id:req.params.id
    },
    {
      $set:{
        password:hashedPassword
      }
    }
    
  );
  res.status(200).json({message:"Password Reset Successfully",email: verify.email, status: "verified", user })

  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Internal Server Error"})
  }
})

//getall code 
router.get("/getall",async(req,res)=>{
  try {
    let users = await User.find({});
    if(!users){
      res.status(400).json({message:"Users not found"})
    }
    res.status(200).json({message:"Users found successfully",users})
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Internal Server Error"})
  }
})

//get single user code

router.get("/get/:id",async(req,res)=>{
  try {
    let user = await User.findOne({_id:req.params.id})
    if(!user){
      res.status(400).json({message:"User does not found"})
    }
    res.status(200).json({message:"User found successfully",user})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal Server Error"})
  }
})

router.put("/edit/:id",upload.single('avatar') ,async(req,res)=>{
  try {
    let avatar ;

   let BASE_URL = process.env.BACKEND_URL;
        if(process.env.NODE_ENV === "production"){
            BASE_URL = `${req.protocol}://${req.get('host')}`
        }
   if(req.file){
    avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
}
    let user = await User.findByIdAndUpdate(
      req.params.id,
      {...req.body,avatar},
      {new:true}
    
    )
    if(!user){
      res.status(400).json({message:"Updated occured Error"})
    }
    res.status(200).json({message:"Updated Successfully",user})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal Server Error"})
  }
})

const userRouter = router;

module.exports = {userRouter}