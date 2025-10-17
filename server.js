import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// Routes
app.use("/api/auth", authRoutes);

// Chat server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const users = {};

io.on("connection", (socket) => {
  console.log(`New user connected: ${socket.id}`);

  socket.on("set username", ({ username, room }) => {
    socket.username = username;
    socket.room = room;
    socket.join(room);

    const joinMsg = {
      username,
      systemMessage: "joined the chat",
      time: new Date().toLocaleTimeString(),
      room,
    };
    io.to(room).emit("user joined", joinMsg);
  });

  socket.on("chat message", ({ username, room, message }) => {
    io.to(room).emit("chat message", {
      username,
      room,
      message,
      time: new Date().toLocaleTimeString(),
    });
  });

 socket.on("disconnect", () => {
    if (socket.username && socket.room) {
      const leaveMsg = {
        username: socket.username,
        systemMessage: "left the chat",
        time: new Date().toLocaleTimeString(),
        room: socket.room,
      };
      io.to(socket.room).emit("user left", leaveMsg);
    }
  });
});

server.listen(3000, () => console.log("🚀 Server running on port 3000"));
