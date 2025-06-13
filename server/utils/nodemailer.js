// server/utils/nodemailer.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Tạo transporter object
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // Cấu hình email
    const mailOptions = {
        from: `Ecommerce App <${process.env.SMTP_MAIL}>`, // Địa chỉ gửi
        to: options.email, // Địa chỉ người nhận
        subject: options.subject, // Chủ đề email
        text: options.message, // Nội dung email dạng text
        html: options.html, // Nội dung email dạng HTML
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;