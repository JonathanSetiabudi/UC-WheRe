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
    origin:
      process.env.NODE_ENV === "production" ? false : ["http://127.0.0.1:5500"],
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"],
  },
});

function generateRandomLetter() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

function generateLobbyCode() {
  const lobbyCode = `${generateRandomLetter()}${generateRandomLetter()}${generateRandomLetter()}${generateRandomLetter()}`;
  if (currLobbies.find((lobby) => lobby.roomCode === lobbyCode)) {
    return generateLobbyCode();
  } else {
    return lobbyCode;
  }
};

currLobbies = [{ roomCode: "TEST", numOfUsers: 0, }];
userRooms = [];

//on connection, logs the message "User connected" and the socket id
//this is basically a list of event listeners
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  //on creating a room, logs the message "User created room" and the room id
  //then emits the createdRoom event to the room with the room id
  socket.on("create_lobby", () => {
    const roomCode = generateLobbyCode();
    let room = {
      roomCode: roomCode,
      numOfUsers: 1,
    };
    currLobbies.push(room);
    console.log(`User(${socket.id}) created room: ${roomCode}`);
    socket.join(roomCode);
    userAndTheirRoom = {
      socketId: socket.id,
      roomCode: roomCode,
    };
    userRooms.push(userAndTheirRoom);
    socket.emit("createdLobby", roomCode);
  });

  //on joining the room, logs the message "User connected to room
  socket.on("join_lobby", (room) => {
    if (currLobbies.find((lobby) => lobby.roomCode === room)) {
      if (currLobbies.find((lobby) => lobby.roomCode === room).numOfUsers < 2) {
        currLobbies.find((lobby) => lobby.roomCode === room).numOfUsers++;
        socket.join(room);
        console.log(`User(${socket.id}) connected to lobby: ${room}`);
        userAndTheirRoom = {
          socketId: socket.id,
          roomCode: room,
        };
        userRooms.push(userAndTheirRoom);
        socket.emit("joinedLobby", room);
      } else {
        console.log(`User(${socket.id}) tried to join full lobby: ${room}`);
        socket.emit("lobbyFull");
      }
    } else {
      console.log(
        `User(${socket.id}) tried to join non-existent lobby: ${room}`,
      );
      socket.emit("lobbyNonExistent");
    }
  });

  //on leaving the room, logs the message "User disconnected from room" and the room id

  socket.on("leave", (room) => {
    console.log(`User(${socket.id}) disconnected from lobby: ${room}`);
    socket.leave(room);
    const user = userRooms.find((user) => user.socketId === socket.id);
    if (user) {
      const roomToDecrement = user.roomCode;
      currLobbies.find((lobby) => lobby.roomCode === roomToDecrement)
        .numOfUsers--;
      userRooms = userRooms.filter((user) => user.socketId !== socket.id);
      if (
        currLobbies.find((lobby) => lobby.roomCode === roomToDecrement)
          .numOfUsers === 0 && roomToDecrement !== "TEST"
      ) {
        currLobbies = currLobbies.filter(
          (lobby) => lobby.roomCode !== roomToDecrement,
        );
        console.log(`Lobby ${roomToDecrement} has been deleted`);
      }
    }
  });

  //on disconnect, logs the message "User disconnected" and the socket id
  socket.on("disconnect", () => {
    console.log(`User(${socket.id}) disconnected`);
    const user = userRooms.find((user) => user.socketId === socket.id);
    if (user) {
      const roomToDecrement = user.roomCode;
      currLobbies.find((lobby) => lobby.roomCode === roomToDecrement)
        .numOfUsers--;
      userRooms = userRooms.filter((user) => user.socketId !== socket.id);
      if (
        currLobbies.find((lobby) => lobby.roomCode === roomToDecrement)
          .numOfUsers === 0 && roomToDecrement !== "TEST"
      ) {
        currLobbies = currLobbies.filter(
          (lobby) => lobby.roomCode !== roomToDecrement,
        );
        console.log(`Lobby ${roomToDecrement} has been deleted`);
      }
    }
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
