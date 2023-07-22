const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const sendFeedbackMail = async (admin_mail,sender,subject,body) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const info = await transporter.sendMail({
    from: sender,
    to: admin_mail,
    subject: subject,
    text: body
  });
};

module.exports = sendFeedbackMail;