import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// Registration route
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, username, email, phone, password, confirmPassword } = req.body;

    // Validation
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Check if username or email exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      phone,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "Registration successful. Please proceed to login." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { loginId, password } = req.body; // loginId = username/email/phone

    if (!loginId || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find user by username/email/phone
    const user = await User.findOne({
      $or: [{ username: loginId }, { email: loginId }, { phone: loginId }]
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    res.status(200).json({ message: "Login successful.", user: { username: user.username, firstName: user.firstName } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
