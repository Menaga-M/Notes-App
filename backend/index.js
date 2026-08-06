import dns from "dns";
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import connectDB from "./config/db.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

connectDB();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});