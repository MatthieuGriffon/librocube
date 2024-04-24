import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, 
    port: process.env.EMAIL_PORT,              
    secure: true,      
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = (to, subject, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html: htmlContent
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

export default sendEmail;
