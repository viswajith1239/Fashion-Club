const nodemailer=require('nodemailer')
const user = require("../models/userModel")
const userController=require('../controllers/userController')
const bcrypt=require('bcrypt')
require("dotenv").config()
// const flash = require('connect-flash');

function generateotp(){
    return Math.floor(100000+Math.random()*900000).toString()
}
const transporter=nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:process.env.EMAIL,
   pass: process.env.PASS
  }  
})



const sentotp=(req,res)=>{
    try{
       
        const {name,email,mobile,password,password1}=req.body;

        req.session.insertData={name,email,mobile,password,password1}
        console.log(req.session.insertData);
        req.session.storedEmail=email;

        const otp=generateotp()
        req.session.storedotp=otp
       
        const expiryTime= 60
        req.session.otpExpiry=Date.now()+expiryTime*1000;

       
        const userEmail=email
       
        if(!userEmail){
            return res.status(400).json({error:"Error or invalid email"})
        }
        const mailOptions={
            from:"viswajithkanayi@gmail.com",
            to:userEmail,
            subject:"Your OTP verification code",
            text: `Your OTP is ${otp}`
        }
        transporter.sendMail(mailOptions,(error)=>{
            if(error){
                console.log(error);
                return res.status(500).json({error:"Error sending OTP email"})
            }
            console.log("otp sent to the user email",otp);
        })

        req.session.otp=otp
        res.redirect('/otp-verification')
    }catch(error){
        console.log(error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}
const verify= async(req,res)=>{
      try{
        const sendedOtp=req.session.otp
        const verifyOtp=req.body.otp
        console.log(sendedOtp);
        console.log(verifyOtp);
        console.log("start checking");

        if(sendedOtp === verifyOtp){
            if(Date.now()<req.session.otpExpiry){
                console.log("otp entered before time expires");
                req.session.otpMatched=true
                req.flash("message","successfully registered")
                res.redirect('/')
            }
        }else{
            console.log("Failed otp verification");
            req.session.otpExpiry=false
            req.flash("error", "Incorrect OTP entered. Please enter the correct OTP.");
            res.redirect('/register')
        }
      }catch(error){
        console.log(error.message);
      }
}
const resendOtp = async(req,res)=>{
    try{
        const otp=generateotp()
        req.session.storedotp=otp
        const {name,email,mobile,password}=req.session.insertData
        console.log("This is the stored otp in session",req.session.storedotp);
        const expiryTime= 60
        req.session.otpExpiry=Date.now()+expiryTime*1000;

        console.log("generate otp:"+otp);
        const userEmail=email
        console.log("this is user email:"+userEmail);
        if(!userEmail){
            return res.status(400).json({error:"Error or invalid email"})
        }
        const mailOptions={
            from:"viswajithkanayi@gmail.com",
            to:userEmail,
            subject:"Your OTP verification code",
            text: `Your OTP is ${otp}`
        }
        transporter.sendMail(mailOptions,(error)=>{
            if(error){
                console.log(error);
                return res.status(500).json({error:"Error sending OTP email"})
            }
            console.log("otp sent to the user email");
        })

        req.session.otp=otp
        res.redirect('/otp-verification')
    }
    catch(error){
        console.log(error.message)
    }
}


module.exports={
    sentotp,
    verify,
    resendOtp

}

