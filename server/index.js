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
    hiddenCards: {},
    numOfUsers: 0,
    difficulty: 0,
    theme: 0,
    numGuesses: 1,
    lobbyGridSize: 16,
    gameBoard: [],
    // hostHasSelected: false,
    // guestHasSelected: false,
    gameStarted: false,
  },
];

//on connection, logs the message "User connected" and the socket id
//this is basically a list of event listeners
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  //on creating a room, logs the message "User created room" and the room id
  //then emits the createdRoom event to the room with the room id
  socket.on("create_lobby", (gameBoard) => {
    const roomCode = generateLobbyCode();
    let room = {
      roomCode: roomCode,
      players: [socket.id],
      readyStatus: { [socket.id]: false },
      hiddenCards: { [socket.id]: null },
      numOfUsers: 1,
      difficulty: 0,
      theme: 0,
      numGuesses: 1,
      lobbyGridSize: 16,
      gameBoard: gameBoard,
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
        socket.to(room).emit("triedJoinFullLobby");
      }
    } else {
      console.log(
        `User(${socket.id}) tried to join non-existent lobby: ${room}`,
      );
      socket.to(room).emit("triedJoinNonExistentLobby");
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

      if (roomToChange.gameStarted) {
        const oppID = roomToChange.players.find((id) => id !== socket.id);

        io.to(oppID).emit("victory");
        console.log(
          `Player ${oppID} wins as they are the only player left in lobby ${roomToChange}`,
        );
      }

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

  socket.on("setHiddenCard", ({ room, hiddenCard }) => {
    const theLobby = currLobbies.find((lobby) => lobby.roomCode === room);
    if (theLobby) {
      if (!theLobby.hiddenCards) {
        theLobby.hiddenCards = {};
      }

      theLobby.hiddenCards[socket.id] = hiddenCard;
      console.log(
        `Player ${socket.id} set their hidden card to ${hiddenCard.name}`,
      );
      //console.log(`Player ${socket.id} set their hidden card`);
    } else {
      console.log(
        `Player ${socket.id} tried to set their hidden card in non-existent lobby`,
      );
    }
  });

  socket.on("tryStartGame", (room) => {
    const theLobby = currLobbies.find((lobby) => lobby.roomCode === room);
    if (theLobby) {
      if (theLobby.numOfUsers === 2) {
        io.to(room).emit("successStartGame");
        io.to(room).emit("updateGameBoard", theLobby.gameBoard);
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

  socket.on("finalizedGuess", ({ room, guessedCardName }) => {
    //console.log(`Player ${socket.id} finalized their guess`);
    const theLobby = currLobbies.find((lobby) => lobby.roomCode === room);
    if (theLobby) {
      //console.log("Hidden Cards:", theLobby.hiddenCards);

      const oppID = theLobby.players.find((id) => id !== socket.id);
      const oppCard = theLobby.hiddenCards[oppID];

      if (guessedCardName === oppCard.name) {
        io.to(socket.id).emit("victory");
        io.to(oppID).emit("defeat");
        console.log(`Player ${socket.id} won by guessing right!`);
      } else {
        io.to(socket.id).emit("incorrectGuess");
        console.log(
          `Player ${socket.id} guessed incorrectly. Decrementing numGuesses available`,
        );
      }
    } else {
      console.log(
        `User(${socket.id}) tried to finalize guess in a non-existent lobby: ${room}`,
      );
    }
  });

  socket.on("ranOutOfGuesses", (room) => {
    const theLobby = currLobbies.find((lobby) => lobby.roomCode === room);
    if (theLobby) {
      const oppID = theLobby.players.find((id) => id !== socket.id);

      io.to(socket.id).emit("defeat");
      io.to(oppID).emit("victory");

      console.log(`Player ${socket.id} ran out of guesses and lost!`);
    } else {
      console.log(
        `User(${socket.id}) ran out of guesses in a non-existent lobby: ${room}`,
      );
    }
  });

  socket.on("doUpdateGameBoard", (data) => {
    const lobbyCode = data.room;
    const room = currLobbies.find((lobby) => lobby.roomCode === lobbyCode);

    if (room) {
      room.gameBoard = data.gameBoard;

      io.to(room).emit("updatingGameBoard", room.gameBoard);
    }
  });

  //upon receiving a settingDifficulty, settingTheme, settingNumGuesses, or settingGridSize
  // event, log "updating ____ setting" and the new difficulty setting

  socket.on("settingDifficulty", (data) => {
    const lobbyCode = data.room;
    const room = currLobbies.find((lobby) => lobby.roomCode === lobbyCode);
    console.log("updating difficulty setting to ", data.boardDifficulty);
    room.difficulty = data.boardDifficulty;
    room.gameBoard = data.gameBoard;
    const updatedData = {
      room: data.room,
      boardDifficulty: room.difficulty,
      gameBoard: room.gameBoard,
    };
    socket.emit("finishedUpdatingDifficulty", updatedData);
  });

  socket.on("settingTheme", (data) => {
    const lobbyCode = data.room;
    const room = currLobbies.find((lobby) => lobby.roomCode === lobbyCode);
    console.log("updating theme setting to ", data.boardTheme);
    room.theme = data.boardTheme;
    room.gameBoard = data.gameBoard;
    const updatedData = {
      room: data.room,
      boardTheme: room.theme,
      gameBoard: room.gameBoard,
    };
    io.emit("finishedUpdatingTheme", updatedData);
  });

  socket.on("settingNumberOfGuesses", (data) => {
    const lobbyCode = data.room;
    const room = currLobbies.find((lobby) => lobby.roomCode === lobbyCode);
    console.log("updating number of guesses to ", data.numGuess);
    room.numGuesses = data.numGuess;
    const updatedData = { room: data.room, numGuess: room.numGuesses };
    socket.to(lobbyCode).emit("finishedUpdatingGuesses", updatedData);
  });

  socket.on("settingGridSize", (data) => {
    const lobbyCode = data.room;
    const room = currLobbies.find((lobby) => lobby.roomCode === lobbyCode);

    console.log("updating gridSize to ", data.gridSize);
    room.lobbyGridSize = data.gridSize;
    room.gameBoard = data.gameBoard;

    const updatedData = {
      room: data.room,
      gridSize: room.lobbyGridSize,
      gameBoard: room.gameBoard,
    };
    io.to(lobbyCode).emit("finishedUpdatingGridSize", updatedData);
  });

  socket.on("testEcho", (data) => {
    const lobbyCode = data.room;
    const roomData = currLobbies.find((lobby) => lobby.roomCode === lobbyCode);
    console.log("current settings: room", lobbyCode);
    console.log("players in lobby:", roomData.numOfUsers);
    console.log("difficulty: ", roomData.difficulty);
    console.log("theme: ", roomData.theme);
    console.log("number of guesses: ", roomData.numGuesses);
    console.log("size of grid: ", roomData.lobbyGridSize);
    console.log("game board: ", roomData.gameBoard);
  });
});

server.listen(8080, () => {
  console.log("listening on 8080");
});
