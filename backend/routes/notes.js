import express from "express";
import jwt from "jsonwebtoken";
import Note from "../models/Note.js";

const router = express.Router();

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: "Authentication required" });
    req.userId = jwt.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired session" });
  }
};

router.get("/", authenticate, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch {
    res.status(500).json({ success: false, message: "Could not load notes" });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const content = req.body.content?.trim() || "";
    if (!title) return res.status(400).json({ success: false, message: "A note title is required" });
    const note = await Note.create({ user: req.userId, title, content });
    res.status(201).json({ success: true, note });
  } catch (error) {
    const message = error.name === "ValidationError" ? "Please keep your note within the allowed length" : "Could not save note";
    res.status(500).json({ success: false, message });
  }
});

export default router;
