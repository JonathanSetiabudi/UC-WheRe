const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

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
    socket.join(room);
  });

  socket.on("leave", (room) => {
    socket.leave(room);
  });

  socket.on("message", ({ message }) => {
    console.log("I AM BEING RECIEVED", message);
    socket.to(123).emit("message", message);
  });
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});
