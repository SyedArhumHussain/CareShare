const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');


module.exports = (req,res,next)=>{
    const {authorization} = req.headers;
    // console.log(authorization);
    if(!authorization){
        return res.status(401).send({error:"user must be logged in ,key not given"}) 
    }
    const token = authorization.replace("Bearer ","")
    // console.log(to
    
    jwt.verify(token,process.env.jwt_secret,async(error,payload) =>
    {
        if(error){
            return res.status(401).send({
                error:"user must be logged in , invalid token "
            })
        }

        const {_id} = payload
        User.findById(_id).then(userdata => {
            req.user = userdata
            next();
        }

        )
    })

}