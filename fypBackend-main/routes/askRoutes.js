const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt =require('bcryptjs'); 

const nodemailer = require('nodemailer');
const Donate = mongoose.model("Donate")
const Ask =mongoose.model("Ask");
require('dotenv').config()

const sendEmail = function (email,address) {

    let mailTransporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        maxMessages: 'infinity',
        pool: true,
        auth: {
            user: 'ashar.usman@commtel.ae',
            pass: '1234567'
        }
    });
    var emailFrom ="ashar.usman@commtel.ae"
    
    var toBcc = email

    var subjects = "CareShare - Collect Your Medicine"


    const mailoptions = {
        from: emailFrom,
        bcc: toBcc,
        subject: subjects,
        html: `<html><body>Dear User,<br/><br/> Your medicine request has been approved. Please come and collect it.  <br/><br/><p style="color:#2F5496">Regards,<br/>CareShare<br/></body></html>`,

    };
    mailTransporter.sendMail(mailoptions)
}

router.post('/ask', async (req, res) => {
    console.log(req.body);
    const { name, email, address, medicineName, medicineQty } = req.body;

    if (!name || !email || !address || !medicineName || !medicineQty) {
        return res.status(422).send({ error: 'Please fill out all the fields' });
    }

    try {
        const existingDonate = await Donate.findOne({ medicineName });

        if (!existingDonate) {
            return res.status(404).send({ error: 'Medicine not found' });
        }

        existingDonate.medicineQty -= medicineQty;

        if (existingDonate.medicineQty <= 0) {
            await Donate.deleteOne({ medicineName });
        } else {
            await existingDonate.save();
        }

        const user = new Ask({
            name,
            email,
            address
        });

        await user.save();
        console.log('exist>>>>>',existingDonate.address)
sendEmail(email,existingDonate.address)
        res.send('done');
    } catch (err) {
        console.log('db err', err);
        return res.status(500).send({ error: err.message });
    }
});

router.get('/askData',async(req,res)=>{
    const database = await Ask.find();
    console.log(database)
    res.send({database})
})

module.exports = router ;