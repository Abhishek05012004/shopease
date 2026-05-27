const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Otp = require("../models/Otp");
const { protect } = require("../middleware/auth");
const { sendOtpEmail } = require("../utils/mailer");

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "30d",
  });
};

// @route   POST /api/auth/send-otp
// @desc    Send registration OTP to email
// @access  Public
router.post(
  "/send-otp",
  [body("email").isEmail().withMessage("Please enter a valid email")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Generate a 6-digit numeric OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Upsert the OTP in database (update if exists, insert if not)
      await Otp.findOneAndUpdate(
        { email: email.toLowerCase() },
        { otp, createdAt: new Date() },
        { upsert: true, new: true }
      );

      // Send OTP to email
      await sendOtpEmail({ to: email, otp });

      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("Send OTP Error:", error);
      res.status(500).json({ message: "Server error sending OTP" });
    }
  }
);

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("otp").notEmpty().withMessage("OTP is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, otp } = req.body;

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Verify OTP
      const otpRecord = await Otp.findOne({ email: email.toLowerCase() });
      if (!otpRecord || otpRecord.otp !== otp) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Delete the OTP record since it's verified and used
      await Otp.deleteOne({ _id: otpRecord._id });

      // Create user
      const user = await User.create({
        name,
        email,
        password,
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).json({ message: "Invalid user data" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;
      console.log(`Login attempt for email: ${email}`);

      // Check for user
      const user = await User.findOne({ email });

      if (!user) {
        console.log(`User not found for email: ${email}`);
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await user.comparePassword(password);
      console.log(
        `Password validation result for ${email}: ${isPasswordValid}`
      );

      if (isPasswordValid) {
        const token = generateToken(user._id);
        console.log(`Login successful for user: ${email}`);

        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: token,
        });
      } else {
        console.log(`Invalid password for user: ${email}`);
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  }
);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset OTP
// @access  Public
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Please enter a valid email")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User with this email does not exist" });
      }

      // Generate a 6-digit numeric OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Upsert OTP in database
      await Otp.findOneAndUpdate(
        { email: email.toLowerCase() },
        { otp, createdAt: new Date() },
        { upsert: true, new: true }
      );

      // Send OTP to email
      await sendOtpEmail({ to: email, otp, type: "forgot" });

      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("Forgot password OTP error:", error);
      res.status(500).json({ message: "Server error sending OTP" });
    }
  }
);

// @route   POST /api/auth/reset-password
// @desc    Reset password using OTP
// @access  Public
router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("otp").notEmpty().withMessage("OTP is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, otp, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // Verify OTP
      const otpRecord = await Otp.findOne({ email: email.toLowerCase() });
      if (!otpRecord || otpRecord.otp !== otp) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Delete OTP
      await Otp.deleteOne({ _id: otpRecord._id });

      // Update password
      user.password = password;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Server error resetting password" });
    }
  }
);

module.exports = router;
