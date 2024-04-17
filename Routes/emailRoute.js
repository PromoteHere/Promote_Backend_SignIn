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
        subject: "Your OTP for verification",
        text: `Your OTP is ${otp}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="text-align: center; color: #333;">Your OTP for verification</h2>
            <p style="font-size: 16px;">Dear ${signedUpUser},</p>
            <p style="font-size: 16px;">Your OTP for verification is: <strong>${otp}</strong></p>
            <p style="font-size: 16px;">Please use this OTP to complete the verification process.</p>
            <p style="font-size: 16px;">This OTP is valid for 5 minutes.</p>
            <div style="text-align: center; margin-top: 20px;">
                <img src="https://i.ibb.co/CMgscCm/Promote-logo.png" alt="Company Logo" style="max-width: 150px;">
            </div>
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
