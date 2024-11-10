const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", (room) => {
    console.log(`User connected ${room}: ${socket.id}`);
    socket.join(room);
  });

  socket.on("leave", (room) => {
    console.log(`User disconnected: ${socket.id}`);
    socket.leave(room);
  });

  socket.on("message", (message) => {
    console.log("I AM BEING RECIEVED", message);
    socket.to(123).emit("message", message);
  });
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});
