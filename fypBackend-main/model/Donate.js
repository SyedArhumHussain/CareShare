const mongoose = require('mongoose');
const bcrypt =require('bcryptjs');
const donateSchema = new mongoose.Schema({
    name:{
        type:String,
        // required:true
    },
    email:{
        type:String,
        // required:true
    },
    address:{
        type:String,
        // required:true
    },
    city:{
        type:String,
        required:false
    },
    location:{
        type:String
    },
    // Phone number of the donor (optional but recommended for contact purposes)
    mobile:{
        type:String,
        default:''
    },
    medicineName:{
        type:String,
        // required:true
    },
    medicineQty:{
        type:String,
        // required:true
    },
    medicineImg:{
        type:String,
        // required:true
    },
    medicineExp:{
        type:String,
        // required:true
    },
    status:{
        type:String
    }
    },
    { timestamps: true } // Add timestamps for creation and update dates
)


mongoose.model("Donate",donateSchema);