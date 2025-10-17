const users = new Map();

export default function registerUserHandlers(io, socket) {
  socket.on("join", (username) => {
    users.set(socket.id, username);
    io.emit("userJoined", { username });
  });

  socket.on("disconnect", () => {
    const username = users.get(socket.id);
    if (username) {
      io.emit("userLeft", { username });
      users.delete(socket.id);
    }
  });
}
