const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');
const bcrypt =require('bcryptjs'); 
const db = require("../db")
require('dotenv').config()

router.post('/signup',(req,res)=>{  
    console.log('Signup request body:', req.body);
    const {fname, lname, email, password, userRole}=req.body;
    
    // Validate all required fields
    if(!fname || !lname || !email || !password || !userRole){
        console.log('Missing fields:', {fname, lname, email, password, userRole});
        return res.status(422).send({error:'Please fill out all the required fields'})
    }

    User.findOne({email:email})
        .then(
            async(savedUser)=>{
                if (savedUser){
                    return res.status(422).send({error:'Email already exists'}) 
                 }
                 const user = new User({
                    fname,
                    lname,
                    email,
                    password,
                    userRole                    
                })
                
                try{
                    await user.save()
                    const token = jwt.sign({_id:user._id},process.env.jwt_secret);
                    res.send({token});
                }
                catch(err){
                    console.log('Database error:', err)
                    return res.status(422).send({error:err.message});
                }
            }
        )
        .catch(err => {
            console.log('Error finding user:', err);
            return res.status(500).send({error:'Server error occurred'});
        });
})

router.post('/signin',async(req,res)=>{
  
    console.log(req.body);
    
    const{email,password}=req.body;
    if(!email || !password){
        return res.status(422).send({error:"enter email and password"})
    }

    const savedUser = await User.findOne({email:email})
    if(!savedUser){
        return res.status(422).send({error:"inavlid credentials"})
    }
    try{
        bcrypt.compare(password,savedUser.password,(err,result)=>{
            if(result){
                const token = jwt.sign({_id:savedUser._id},process.env.jwt_secret, { expiresIn: '2h' });
                // res.send({token});
                if(savedUser.userRole=='donor'){
                    // res.send(savedUser)
                    res.send({token, data:'donor'})
                }
                else if(savedUser.userRole=='admin'){
                    // res.send(savedUser)
                    res.send({token, data:'admin'})

                }
                else{
                    // res.send(savedUser)
                    res.send({token, data:'receipient'})

                }
            }
            else{
                return res.status(422).send({error:"inavlid credentials"})
            }
        })
    }
    catch(err){
        console.log(err)
    }
})

router.get('/receipient',async(req,res)=>{
    const database = await User.find({userRole:"receipient"});
    console.log(database)
    res.status(200).json(database)
})

router.get('/donor',async(req,res)=>{
    const database = await User.find({userRole:"donor"});
    console.log(database)
    res.status(200).json(database)
})

module.exports = router ;