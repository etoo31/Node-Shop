const nodemailer = require("nodemailer");

require("dotenv").config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASSWORD,
  },
});

exports.sendMail = (mailOptions) => {
  return transporter.sendMail(mailOptions);
};
