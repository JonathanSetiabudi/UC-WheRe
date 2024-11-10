//imports express module as express
const express = require("express");
//creates an instance of express called app
const app = express();
//imports http module as http
const http = require("http");
//creates server using the createServer method from the http module
//and assigns it to the variable server
const server = http.createServer(app);
//imports socket.io module as { Server }
const { Server } = require("socket.io");
//creates an instance of Server called io
const io = new Server(server, {
  //cors configuration
  //origin is set to false if the NODE_ENV is production
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://127.0.0.1:5500'],
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"],
  },
});
//sets up event listener for new connections
//on connection, logs the user id where socket is the user
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
  //event listener for joining
  //on join, joins the user to the room
  socket.on("join", (room) => {
    socket.join(room);
  });

  //event listener for leave
  //on leave, disconnects the user from the room
  socket.on("leave", (room) => {
    socket.leave(room);
  });

  //event listener for message
  //on message, logs the message and emits the message to the room
  socket.on("message", ({ message }) => {
    console.log("I AM BEING RECIEVED", message);
    socket.to(123).emit("message", message);
  });
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});
