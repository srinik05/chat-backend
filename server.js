// server.js
import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.get("/", (req, res) => {
  res.send("Chat app backend is running successfully 🚀");
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "https://chat-frontend-gamma-three.vercel.app"], // allow both ports
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Replace this with your connection string
const MONGO_URI = "mongodb+srv://srinivas4in_db_user:asbf8lTWto0FVxYM@cluster0.9g4rt1v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id);

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});