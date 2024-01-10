const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
require('dotenv').config();

async function sendMail(details) {
  /* eslint-disable no-undef */
  const emailTemplate = fs.readFileSync('utils/' + details.emailFile, 'utf8');
  const transporter = nodemailer.createTransport({
      host: process.env.NODE_ENV === 'production' ? process.env.EMAIL_HOST : process.env.MAILTRAP_HOST,
      port: process.env.NODE_ENV === 'production' ? process.env.EMAIL_PORT : process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.NODE_ENV === 'production' ? process.env.EMAIL_USER : process.env.MAILTRAP_USER,
        pass: process.env.NODE_ENV === 'production' ? process.env.EMAIL_PASSWORD : process.env.MAILTRAP_PASSWORD
      }
  });
  /* eslint-enable no-undef */

  const renderedEmail = ejs.render(emailTemplate, details);
  
  try {
    await transporter.sendMail({
      from: details.from, 
      to: details.to, 
      subject: details.subject,
      html: renderedEmail
    });
  } catch (error) {
    return error;
  }
}

module.exports = sendMail;