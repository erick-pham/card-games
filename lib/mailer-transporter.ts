import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

// const mailOptions = {
//   from: "youremail@gmail.com",
//   to: "myfriend@yahoo.com",
//   subject: "Sending Email using Node.js",
//   text: "That was easy!",
// };

export default transporter;
