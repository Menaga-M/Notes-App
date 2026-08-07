import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();

router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id).select("name email");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired session" });
  }
});

router.post("/register", async (req, res) => {
  
  try {
    // Check if the user already exists
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    } else {
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.status(201).json({
        success: true,
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
        message: "Account created successfully",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  
  try {
    // Check if the user already exists
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not exist" });
    } 

    const checkpassword = await bcrypt.compare(password, user.password);
    if (!checkpassword) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "5h" });
    return res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
      message: "Logged in successfully",
    });
 
} catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
