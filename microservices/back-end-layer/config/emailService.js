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

// Function to send reset password email
export const sendResetPasswordEmail = async (email, resetToken) => {
    try {
        // Use iOS deep link
        const deepLink = `signify://reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Signify - Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #8EB1CF;">Password Reset Request</h2>
                    <p>You have requested to reset your password. Tap the button below to open Signify and reset your password:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${deepLink}" style="background-color: #8EB1CF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password in Signify</a>
                    </div>
                    <p style="color: #666; font-size: 14px;">Note: This button will only work if you have Signify installed on your iOS device.</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this password reset, please ignore this email.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Reset password email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending reset password email:', error);
        throw new Error('Failed to send reset password email');
    }
}; 