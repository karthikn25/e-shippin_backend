const express = require('express');
const { Product } = require('../Models/productModel');


const router = express.Router();

router.post("/addPost",async(req,res)=>{
    try {
        let products = await Product.find({});

        if(!products){
            res.status(400).json({message:"Product not created"})
        }
        res.status(200).json({message:"Product created successfully",products})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
})