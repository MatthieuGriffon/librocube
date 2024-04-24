import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.fr', 
    port: 465,              
    secure: true,      
    auth: {
        user: 'postmaster@matthieu-griffon.fr',
        pass: '44Xstd6f-@'
    }
});

const sendEmail = (to, subject, htmlContent) => {
    const mailOptions = {
        from: 'postmaster@matthieu-griffon.fr',
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
