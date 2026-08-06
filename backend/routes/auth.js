import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
const router = express.Router();

router.post("/register", async (req, res) => {
  
  try {
    // Check if the user already exists
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    } else {
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ success: true, message: "Account created successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;