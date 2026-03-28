const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  host: process.env.NODE_MAILER_HOST,
  port: process.env.NODE_MAILER_PORT,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.NODE_EMAIL_USER,
    pass: process.env.NODE_EMAIL_USER_PASS,
  },
});


const SendVerificationCode = async(email,verificationcode)=>{
    try {
        const response = await transporter.sendMail({
            from: `"Email 👻" ${process.env.NODE_EMAIL_USER}`, // sender address
            to: email, // list of receivers
            subject: "Your Registration Verification Code", // Subject line
            text: `Your Registration verification code is: ${verificationcode}`, // plain text body
            html: `<p>Your Registration verification code is: <b>${verificationcode}</b></p>`, // html body
          });
          return (response);
    } catch (error) {
        return (error)
    }
}
const sendReplyEmail = async (toEmail, subject, body, inReplyTo) => {
  try {
    // Ensure proper <> format
    const formattedInReplyTo = inReplyTo.startsWith("<") 
      ? inReplyTo 
      : `<${inReplyTo}>`;
    const response = await transporter.sendMail({
      from: `"Support Team" <${process.env.NODE_EMAIL_USER}>`,
      to: toEmail,  
      subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
      text: body,
      inReplyTo: formattedInReplyTo,
      references: formattedInReplyTo, 
    });

    return {
      response,
      messageId: response.messageId,
    };
  } catch (error) {
    throw error;
  }
};
module.exports = { SendVerificationCode , sendReplyEmail}