const nodemailer = require("nodemailer");

module.exports = transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "mailerbot735@gmail.com",
    pass: "Botmailer"
  }
})