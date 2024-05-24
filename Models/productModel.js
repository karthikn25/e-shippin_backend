const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema;

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        
    },
    price:{
        type:Number,
        required:true, 
        trim:true,

    },
    features:{
        type:String,
        trim:true
    },
    offers:{
        type:String, 
        trim:true
    },
    images:[
        {
            image:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:ObjectId,
        ref:'user'
    },
    date:{
        type:String,
        requierd:true
    }
})


const Product = mongoose.model("product",productSchema);


module.exports = {Product}