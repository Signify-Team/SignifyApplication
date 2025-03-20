/**
 * @file emailService.js
 * @description Email service configuration using Nodemailer
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Function to send verification email
export const sendVerificationEmail = async (email, verificationCode) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Signify - Email Verification',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #8EB1CF;">Welcome to Signify!</h2>
                    <p>Thank you for signing up. Please use the following verification code to verify your email address:</p>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
                        <h1 style="color: #8EB1CF; margin: 0;">${verificationCode}</h1>
                    </div>
                    <p>This code will expire in 5 minutes.</p>
                    <p>If you didn't request this verification, please ignore this email.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
    }
}; 