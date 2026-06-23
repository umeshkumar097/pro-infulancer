const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: `"Behavioural Compass" <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,
  subject: 'Test Email from Behavioural Compass',
  text: 'This is a test email to verify that SMTP is working properly.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error sending email:', error);
  } else {
    console.log('Test email sent successfully! Message ID:', info.messageId);
  }
});
