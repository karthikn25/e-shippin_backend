const mongoose = require('mongoose');


const dbConnection = ()=>{
    const params = {
        useUnifiedTopology:true,
        useNewUrlParser:true
    }
    try {
        mongoose.connect(process.env.Mongo_url,params);
        console.log("Mongodb Connected Successfully");
    } catch (error) {
        console.log("mongoose Error",error)
        
    }
}

module.exports = {dbConnection}