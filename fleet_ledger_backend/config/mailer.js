const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any email service (e.g., SendGrid, Outlook, etc.)
    auth: {
        user: process.env.EMAIL_USER, // Your email (stored in .env)
        pass: process.env.EMAIL_PASS  // Your email password (stored in .env)
    }
});

/**
 * Send an email using Nodemailer
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Email body content
 */
const sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending email: ${error}`);
    }
};

module.exports = sendMail;
