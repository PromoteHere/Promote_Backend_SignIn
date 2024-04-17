const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();



const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
};


const otps = {};


router.post('/generate-otp', async (req, res) => {
    const email = req.body.email;
    const signedUpUser = req.body.newuser;
    const otp = generateOTP();
    const mailOptions = {
        from: {
            name: "Promote",
            address: process.env.USER
        },
        to: [email],
        subject: "Welcome to Promote!. Your OTP for verification",
        text: `Your OTP is ${otp}`,
        html: `
        <div style="background-color: #7844c4; padding: 70px;">
                <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 5px 10px ;">
                    <img src="http://localhost:8080/images/promote.jpg" alt="Promote Logo" style="width: 100%;">
                    <h2 style="color: #222; font-size: 18px; margin-top: 20px; text-align: center">Dear ${signedUpUser},</h2>
                    <h2 style="color: #222; font-size: 18px; margin-top: 20px; text-align: center">Here is your One Time Password</h2>
                    <h4 style="color: #222; font-size: 18px; margin-top: 20px; text-align: center; font-weight:100;">to validate your email address</h4>
                    <h1 style="text-align: center">${otp}</h1>
                    <h4 style="color: #Bf2f2a; font-size: 18px; margin-top: 20px; text-align: center; font-weight:100;">Valid for 5 minutes only</h4>
                    
            </div>
            <div style="padding-top: 20px; text-align: center;"> <a  style="color: #D3D3D3; font-size: 18px; margin-top: 20px; text-align: center; font-weight:100; cursor: pointer;">Terms & Conditions  |</a> <a  style="color: #D3D3D3; font-size: 18px; margin-top: 20px; text-align: center; font-weight:100; cursor: pointer;"> Contact Us </a></div>
            </div>
    `,
    };

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.email",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: process.env.USER,
              pass: process.env.APP_PASSWORD,
            },
        });
        const generateOTP = async (transporter, mailOptions) => {
            await transporter.sendMail(mailOptions);
        }
        generateOTP(transporter, mailOptions)
        otps[email] = {
            otp: otp,
            expiry: Date.now() + 300000 // OTP expires after 5 mins
        };
        res.send("OTP sent successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to send OTP.");
    }
});


router.post('/verify-otp', (req, res) => {
    const email = req.body.email;
    const otpAttempt = req.body.otp;
    const otpData = otps[email];

    if (!otpData) {
        return res.status(400).send("OTP not found. Please generate a new OTP.");
    }

    if (otpData.expiry < Date.now()) {
        delete otps[email];
        return res.status(400).send("OTP expired. Please generate a new OTP.");
    }

    if (otpAttempt === otpData.otp.toString()) {
        delete otps[email];
        res.send("OTP verified successfully.");
    } else {
        res.status(400).send("Incorrect OTP.");
    }
});

module.exports = router;
