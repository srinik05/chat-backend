import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js"; // optional JWT auth

const router = express.Router();

router.get("/users", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  try {
    const users = await User.find({ role: "admin" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
