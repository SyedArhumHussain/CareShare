const mongoose = require('mongoose');
const bcrypt =require('bcryptjs');
const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    userRole:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:false
    }
    }
)

userSchema.pre('save',async function(next){
    const user = this;
    console.log(
        'before saving before hashing',user.password
    );
    if (!user.isModified('password')){
        return next();
    }
    user.password = await bcrypt.hash(this.password,8);
    console.log(
        'before saving after hashing',user.password
    );
    next();
})

mongoose.model("User",userSchema);