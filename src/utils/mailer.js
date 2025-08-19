import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP connection error due to ", error);
  } else {
    console.log("SMTP Server connected successfully");
  }
});

export const sendOTPtoEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "OTP verification of Plantree Shop & Services",
    html: `<p>${otp}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    const err = new Error("Failed to send email");
    error.statusCode = 400;
    throw err;
  }
};
