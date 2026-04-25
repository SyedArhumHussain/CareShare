const mongoose = require('mongoose');
require('dotenv').config();


mongoose.set('strictQuery', false);
 mongoose.connect(process.env.mongo_URL).then(
    () => {
        console.log('connected to database') 
    }
 ) 
  .catch((err)=>{
    console.log('could not connect to db ',err )
  })
  module.exports = mongoose