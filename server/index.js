//imports express module as express
const express = require("express");
//imports http module as http
const http = require("http");
//imports socket.io module as { Server }
const { Server } = require("socket.io");
//imports cors module as cors
const cors = require("cors");
const { isNullOrUndefined } = require("util");

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
}

currLobbies = [
  {
    roomCode: "TEST",
    players: [],
    readyStatus: {},
    numOfUsers: 0,
    difficulty: 0,
    theme: 0,
    numGuesses: 1,
    gridSize: 16,
    hostHasSelected: false,
    guestHasSelected: false,
    gameStarted: false,
  },
];

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
      players: [socket.id],
      readyStatus: { [socket.id]: false },
      numOfUsers: 1,
      difficulty: 0,
      theme: 0,
      numGuesses: 1,
      gridSize: 16,
    };
    currLobbies.push(room);
    console.log(`User(${socket.id}) created room: ${roomCode}`);
    socket.join(roomCode);
    socket.emit("createdLobby", roomCode);
    console.log(`Players in ${roomCode}`, room.players);
  });

  //on joining the room, logs the message "User connected to room
  socket.on("join_lobby", (room) => {
    if (currLobbies.find((lobby) => lobby.roomCode === room)) {
      if (currLobbies.find((lobby) => lobby.roomCode === room).numOfUsers < 2) {
        currLobbies.find((lobby) => lobby.roomCode === room).numOfUsers++;
        socket.join(room);
        console.log(`User(${socket.id}) connected to lobby: ${room}`);
        currLobbies
          .find((roomToBeFound) => roomToBeFound.roomCode === room)
          .players.push(socket.id);
        if (
          currLobbies.find((lobby) => lobby.roomCode === room).numOfUsers === 2
        ) {
          console.log(`Lobby (${room}) is now full`);
        }
        console.log(
          `Players in ${room}`,
          currLobbies.find((roomToBeFound) => roomToBeFound.roomCode === room)
            .players,
        );
        socket.emit("joinedLobby", room);
      } else {
        console.log(`User(${socket.id}) tried to join full lobby: ${room}`);
        socket.to(data.room).emit("triedJoinFullLobby");
      }
    } else {
      console.log(
        `User(${socket.id}) tried to join non-existent lobby: ${room}`,
      );
      socket.to(data.room).emit("triedJoinNonExistentLobby");
    }
  });

  //on leaving the room, logs the message "User disconnected from room" and the room id

  socket.on("leave", (room) => {
    console.log(`User(${socket.id}) disconnected from lobby: ${room}`);
    socket.leave(room);
    const roomToChange = currLobbies.find((lobby) =>
      lobby.players.includes(socket.id),
    );
    if (roomToChange) {
      const roomToDecrement = roomToChange.roomCode;
      roomToChange.numOfUsers--;
      if (roomToChange.players[0] === socket.id) {
        socket.to(roomToChange.roomCode).emit("hostLeft");
      } else if (roomToChange.gameStarted === true) {
        socket.to(roomToChange.roomCode).emit("guestLeftMidGame");
      } else {
        roomToChange.players = roomToChange.players.filter(
          (player) => player !== socket.id,
        );
      }
      if (roomToChange.numOfUsers === 0 && roomToChange.roomCode !== "TEST") {
        currLobbies = currLobbies.filter(
          (lobby) => lobby.roomCode !== roomToChange.roomCode,
        );
        console.log(`Lobby ${roomToDecrement} has been deleted`);
      }
    }
  });

  //on disconnect, logs the message "User disconnected" and the socket id
  socket.on("disconnect", () => {
    console.log(`User(${socket.id}) disconnected`);
    const roomToChange = currLobbies.find((lobby) =>
      lobby.players.includes(socket.id),
    );
    if (roomToChange) {
      const roomToDecrement = roomToChange.roomCode;
      currLobbies.find((lobby) => lobby.roomCode === roomToDecrement)
        .numOfUsers--;
      roomToChange.players = roomToChange.players.filter(
        (player) => player !== socket.id,
      );

      delete roomToChange.readyStatus[socket.id]; // del room's readiness status

      if (
        currLobbies.find((lobby) => lobby.roomCode === roomToDecrement)
          .numOfUsers === 0 &&
        roomToDecrement !== "TEST"
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

  socket.on("answerQuestion", (answer, room, author) => {
    console.log("Answer received", answer);
    socket.to(room).emit("receivedAnswer", answer, author);
  });

  socket.on("selectCard", (data) => {
    if (data.isHost === true) {
      currLobbies.find(
        (lobby) => lobby.roomCode === data.room,
      ).hostHasSelected = true;
    } else {
      currLobbies.find(
        (lobby) => lobby.roomCode === data.room,
      ).guestHasSelected = true;
    }
  });

  socket.on("tryStartGame", (room) => {
    const theLobby = currLobbies.find((lobby) => lobby.roomCode === room);
    if (theLobby) {
      if (theLobby.numOfUsers === 2) {
        io.to(room).emit("successStartGame");
        theLobby.gameStarted = true;
        console.log(
          `Host User(${socket.id}) successsfully started a game in lobby: ${room}`,
        );
      } else {
        io.to(room).emit("failStartGame");
        console.log(
          `Host User(${socket.id}) failed to start a game in lobby: ${room}`,
        );
      }
    } else {
      console.log(
        `Host User(${socket.id}) tried to start game in a non-existent lobby: ${room}`,
      );
    }
  });

  socket.on("tryLaunchGame", (room) => {
    const theLobby = currLobbies.find((lobby) => lobby.roomCode === room);
    if (theLobby) {
      if (!room.readyStatus) {
        room.readyStatus = {};
      }

      theLobby.readyStatus[socket.id] = true; // set readyStatus to true
      console.log(`Player ${socket.id} in room ${room} is ready`);

      const allReady = Object.values(theLobby.readyStatus).every(
        (status) => status === true,
      );
      if (allReady) {
        io.to(room).emit("launchGame");
        console.log(`2/2 players in room ${room} are ready. Launching game`);
      } else {
        io.to(room).emit("waitingForOtherReady");
        console.log(`1/2 players in ${room} are ready. Cannot launch game`);
      }
    } else {
      console.log(
        `User(${socket.id}) tried to launch game in a non-existent lobby: ${room}`,
      );
    }
  });

  socket.on("playerCancelledReady", (room) => {
    const theLobby = currLobbies.find((lobby) => lobby.roomCode === room);
    if (theLobby) {
      theLobby.readyStatus[socket.id] = false; // player is no longer ready
      console.log(`Player ${socket.id} in room ${room} is no longer ready`);
    } else {
      console.log(
        `User(${socket.id}) tried to cancel ready in a non-existent lobby: ${room}`,
      );
    }
  });

  socket.on("finalizedGuess", () => {
    console.log(`Player ${socket.id} finalized their guess`);
  });

  //upon receiving a settingDifficulty, settingTheme, settingNumGuesses, or settingGridSize
  // event, log "updating ____ setting" and the new difficulty setting

  socket.on("settingDifficulty", (data) => {
    console.log("updating difficulty setting to ", data.BoardDifficulty);
  });

  socket.on("settingTheme", (data) => {
    console.log("updating theme setting to ", data.BoardTheme);
  });

  socket.on("settingNumberOfGuesses", (data) => {
    console.log("updating number of guesses to ", data.numGuess);
  });

  socket.on("settingGridSize", (data) => {
    console.log("updating gridSize to ", data.gridSize);
  });
});

server.listen(8080, () => {
  console.log("listening on 8080");
});
