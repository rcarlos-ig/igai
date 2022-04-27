// Requirements
const nodemailer = require("nodemailer");

// Send the email
const sendEmail = async (email, html) => {
  
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      }
    })
  

    const info = await transporter.sendMail({
      from: `SEJIN - IGAI ${process.env.MAIL_SENDER}`,
      to: email,
      subject: "Redefinição de senha.",
      html: html,
    });

    console.log(info);
};

module.exports = sendEmail;
