const sendEmail = require("../utils/sendEmail");
const Otp = require("../models/Otp");
const User = require("../models/User");

const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =======================================
// Register User
// =======================================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// Login User
// =======================================
exports.loginUser = async (req, res) => {
  try {
    console.log("JWT_SECRET =", process.env.JWT_SECRET);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("USER:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", match);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =======================================
// Forgot Password (Send OTP)
// =======================================
exports.forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old OTP
    await Otp.deleteMany({ email });

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    // Save OTP
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send Email
    await sendEmail(
      email,
      "Alpha Tech - Password Reset OTP",
      `
      <div style="font-family:Arial;padding:20px">
        <h2>Password Reset</h2>

        <p>Hello <b>${user.name}</b>,</p>

        <p>Your OTP is:</p>

        <h1 style="color:#2563eb;letter-spacing:8px">
          ${otp}
        </h1>

        <p>This OTP will expire in 10 minutes.</p>

        <br>

        <p>If you didn't request this password reset, ignore this email.</p>

        <br>

        <b>Alpha Tech Team</b>
      </div>
      `
    );

    res.json({
      success: true,
      message: "OTP Sent Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =======================================
// Verify OTP
// =======================================
exports.verifyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const otpData = await Otp.findOne({
      email,
      otp,
    });

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otpData.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    res.json({
      success: true,
      message: "OTP Verified Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// =======================================
// Reset Password
// =======================================
exports.resetPassword = async (req, res) => {
  try {

    const { email, otp, password } = req.body;

    // Find OTP
    const otpData = await Otp.findOne({
      email,
      otp,
    });

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check OTP Expiry
    if (otpData.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update Password
    await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      }
    );

    // Delete OTP
    await Otp.deleteMany({ email });

    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};