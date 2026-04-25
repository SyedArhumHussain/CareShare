const mongoose = require('mongoose');
const bcrypt =require('bcryptjs');
const askSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    }
    }
)

mongoose.model("Ask",askSchema);