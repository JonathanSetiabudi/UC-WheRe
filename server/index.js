//imports express module as express
const express = require("express");
//imports http module as http
const http = require("http");
//imports socket.io module as { Server }
const { Server } = require("socket.io");
//imports cors module as cors
const cors = require("cors");

//creates an instance of express called app
const app = express();
//uses the cors module
app.use(cors());
//creates server using the createServer method from the http module and assigns it to the variable server
const server = http.createServer(app);

//creates an instance of the Server class from the socket.io module and assigns it to the variable io
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


//on connection, logs the message "User connected" and the socket id
//this is basically a list of event listeners
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  //on joining the room, logs the message "User connected to room
  socket.on("join_lobby", (room) => {
    console.log(`User(${socket.id}) connected to room: ${room}`);
    socket.join(room);
  });

  //on leaving the room, logs the message "User disconnected from room" and the room id

  socket.on("leave", (room) => {
    console.log(`User(${socket.id}) disconnected from room: ${room}`);
    socket.leave(room);
  });

  //on disconnect, logs the message "User disconnected" and the socket id
  socket.on("disconnect", () => {
    console.log(`User(${socket.id}) disconnected`);
  });

  //on receiving a sendMessage event, logs the message "I AM BEING RECIEVED" and the data
  //then emits the receivedMessage event to the room with the message
  socket.on("sendMessage", (data) => {
    console.log("I AM BEING RECIEVED", data);
    socket.to(data.room).emit("receivedMessage", data);
  });
});

server.listen(8080, () => {
  console.log("listening on 8080");
});
