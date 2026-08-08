import dns from "dns";
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/notes.js";
import connectDB from "./config/db.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "").split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error("Origin not allowed by CORS"));
}}));
app.use(express.json({ limit: "100kb" }));
app.get("/api/health", (_req, res) => res.json({ success: true, status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

const port = Number(process.env.PORT) || 5000;
connectDB().then(() => {
  app.listen(port, () => console.log(`Server is running on port ${port}`));
});
