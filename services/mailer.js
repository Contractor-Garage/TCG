const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: 'webmaster@contractorgarage.com',
        pass: process.env.ZOHO_APP_PASSWORD,
    },
});

module.exports = { transporter };
