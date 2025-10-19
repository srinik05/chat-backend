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

// Map to track connected users: username -> socket.id
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log(`New user connected: ${socket.id}`);

  // Set username
  socket.on("set username", ({ username }) => {
    socket.username = username;
    connectedUsers.set(username, socket.id);
    console.log("Connected users:", Array.from(connectedUsers.keys()));
  });

  // Join one-to-one chat room
  socket.on("join chat", ({ fromUser, toUser }) => {
    const room = [fromUser, toUser].sort().join("_"); // unique room per pair
    socket.join(room);
    socket.room = room;

    // Optional: notify room users
    io.to(room).emit("user joined", {
      username: fromUser,
      systemMessage: "joined the chat",
      time: new Date().toLocaleTimeString()
    });
  });

  // Send message
  socket.on("chat message", ({ fromUser, toUser, message }) => {
    const time = new Date().toLocaleTimeString();
    const msgData = { from: fromUser, to: toUser, message, time };

    // ✅ Send to sender with self: true (right)
    socket.emit("chat message", { ...msgData, self: true });

    // ✅ Send to receiver with self: false (left)
    const receiverSocketId = connectedUsers.get(toUser);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("chat message", { ...msgData, self: false });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    if (socket.username) {
      connectedUsers.delete(socket.username);

      if (socket.room) {
        io.to(socket.room).emit("user left", {
          username: socket.username,
          systemMessage: "left the chat",
          time: new Date().toLocaleTimeString()
        });
      }
    }
  });
});

server.listen(3000, () => console.log("🚀 Server running on port 3000"));
