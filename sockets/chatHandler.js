export default function registerChatHandlers(io, socket) {
  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", {
      user: data.user,
      message: data.message,
      timestamp: new Date()
    });
  });
}