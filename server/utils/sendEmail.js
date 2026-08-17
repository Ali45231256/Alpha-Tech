const transporter = require("../config/email");

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Alpha Tech" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email Sent");
  } catch (err) {
    console.log("❌ Email Error:", err.message);
    throw err;
  }
};

module.exports = sendEmail;