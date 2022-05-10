// Requirements
const nodemailer = require("nodemailer");

// Send the email
const sendEmail = async (email, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  return transporter.sendMail({
    from: `SEJIN - IGAI ${process.env.MAIL_USER}`,
    to: email,
    subject: "Redefinição de senha.",
    html: html,
  });
};

module.exports = sendEmail;
