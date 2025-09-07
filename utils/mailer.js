const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
    service: env.EMAIL_SERVICE,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS
    }
});

const sendForgotPasswordEmail = async (to, resetLink) => {
    const mailOptions = {
        from: `"${env.APP_NAME}" <${env.EMAIL_USER}>`,
        to: to,
        subject: `${env.APP_NAME} - Reset Your Password`,
        text: `Click the link to reset your password: ${resetLink}`,
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <h2 style="color: #4CAF50; text-align: center;">${env.APP_NAME}</h2>
                <p style="font-size: 16px;">Hello,</p>
                <p style="font-size: 16px;">We received a request to reset your password. Click the button below to proceed:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" 
                        style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="font-size: 14px; color: #555;">If you did not request this, please ignore this email. The link will expire in 15 minutes.</p>
                <hr style="border:none;border-top:1px solid #eee; margin: 20px 0;"/>
                <p style="font-size: 12px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} ${env.APP_NAME}. All rights reserved.</p>
            </div>
        </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Forgot Password Email sent successfully:", info.response);
    } catch (error) {
        console.error("Error sending Forgot Password email:", error);
    }
};

const sendOTPEmail = async (to, otp) => {
    const mailOptions = {
        from: `"${env.APP_NAME}" <${env.EMAIL_USER}>`,
        to: to,
        subject: `${env.APP_NAME} - Your OTP Code`,
        text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <h2 style="color: #4CAF50; text-align: center;">${env.APP_NAME}</h2>
                <p style="font-size: 16px;">Hello,</p>
                <p style="font-size: 16px;">Use the OTP below to verify your identity:</p>
                <p style="font-size: 24px; font-weight: bold; color: #333; text-align: center; margin: 20px 0;">${otp}</p>
                <p style="font-size: 14px; color: #555;">This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                <hr style="border:none;border-top:1px solid #eee; margin: 20px 0;"/>
                <p style="font-size: 12px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} ${env.APP_NAME}. All rights reserved.</p>
            </div>
        </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("OTP Email sent successfully:", info.response);
    } catch (error) {
        console.error("Error sending OTP email:", error);
    }
};

module.exports = {
    sendForgotPasswordEmail,
    sendOTPEmail
};
