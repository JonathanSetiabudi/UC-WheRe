import { createServer } from "node:http";
import { io as ioc } from "socket.io-client";
import { Server } from "socket.io";
import { assert } from "chai";
import test from "node:test";

function waitFor(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("Game Tests", () => {
  let io,
    serverSocket1,
    serverSocket2,
    serverSocket3,
    clientSocket1,
    clientSocket2,
    clientSocket3;

  let currLobbies;

  function resetLobbies() {
    currLobbies = [
      {
        roomCode: "TEST",
        players: [],
        numOfUsers: 0,
        difficulty: 0,
        theme: 0,
        numGuesses: 1,
        lobbyGridSize: 16,
        hostHasSelected: false,
        guestHasSelected: false,
        gameStarted: false,
      },
    ];
  }

  before((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket1 = ioc(`http://localhost:${port}`);
      clientSocket2 = ioc(`http://localhost:${port}`);
      clientSocket3 = ioc(`http://localhost:${port}`);
      let connectedClients = 0;

      io.on("connection", (socket) => {
        if (!serverSocket1) {
          serverSocket1 = socket;
        } else if (!serverSocket2) {
          serverSocket2 = socket;
        } else {
          serverSocket3 = socket;
        }
        connectedClients++;
        if (connectedClients === 3) {
          done();
        }
      });
    });

    // Server-Side Event Listeners
    io.on("connection", (socket) => {
      socket.on("create_lobby", () => {
        const roomCode = "ROOM123";
        const room = {
          roomCode: roomCode,
          players: [socket.id],
          numOfUsers: 1,
          difficulty: 0,
          theme: 0,
          numGuesses: 1,
          gridSize: 16,
        };
        currLobbies.push(room);
        socket.join(roomCode);
        socket.emit("createdLobby", roomCode);
      });

      socket.on("join_lobby", (roomCode) => {
        const lobby = currLobbies.find((lobby) => lobby.roomCode === roomCode);
        if (!lobby) {
          socket.emit("triedJoinNonExistentLobby");
          return;
        }
        if (lobby.numOfUsers >= 2) {
          socket.emit("triedJoinFullLobby");
          return;
        }
        lobby.players.push(socket.id);
        lobby.numOfUsers++;
        socket.join(roomCode);
        socket.emit("joinedLobby", roomCode);
      });

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
          if (
            roomToChange.numOfUsers === 0 &&
            roomToChange.roomCode !== "TEST"
          ) {
            currLobbies = currLobbies.filter(
              (lobby) => lobby.roomCode !== roomToChange.roomCode,
            );
            console.log(`Lobby ${roomToDecrement} has been deleted`);
          }
        }
      });

      socket.on("sendMessage", (data) => {
        console.log("I AM BEING RECIEVED", data);
        socket.to(data.room).emit("receivedMessage", data);
      });

      socket.on("answerQuestion", (answer, room, author) => {
        console.log("Answer received", answer);
        socket.to(room).emit("receivedAnswer", answer, author);
      });
    });
  });

  beforeEach(() => {
    resetLobbies();
  });

  after(() => {
    io.close();
    clientSocket1.disconnect();
    clientSocket2.disconnect();
    clientSocket3.disconnect();
  });

  it("should create a lobby", (done) => {
    clientSocket1.emit("create_lobby");

    clientSocket1.once("createdLobby", (roomCode) => {
      assert.equal(roomCode, "ROOM123");
      const roomFound = currLobbies.find((room) => room.roomCode === roomCode);
      assert.isNotNull(roomFound, "ROOM123 not found in currLobbies");
      done();
    });
  });

  it("should join a lobby", (done) => {
    clientSocket1.emit("create_lobby");

    clientSocket1.on("createdLobby", (roomCode) => {
      clientSocket2.emit("join_lobby", roomCode);
    });

    clientSocket2.once("joinedLobby", (roomCode) => {
      const lobby = currLobbies.find((lobby) => lobby.roomCode === roomCode);
      assert.isNotNull(lobby, "Lobby not found");
      assert.equal(lobby.numOfUsers, 2, "Lobby should have 2 users");
      done();
    });
  });

  it("should not let a 3rd person join", (done) => {
    clientSocket1.emit("create_lobby");

    clientSocket1.on("createdLobby", (roomCode) => {
      clientSocket2.emit("join_lobby", roomCode);
      clientSocket3.emit("join_lobby", roomCode);
    });

    clientSocket3.once("triedJoinFullLobby", () => {
      assert.isTrue(true, "3rd client was blocked from joining");
      done();
    });
  });

  it("should delete a lobby when the host leaves", (done) => {
    clientSocket1.emit("create_lobby");

    clientSocket1.once("createdLobby", (roomCode) => {
      clientSocket2.emit("join_lobby", roomCode);
    });

    clientSocket1.emit("leave", "ROOM123");

    clientSocket2.once("hostLeft", () => {
      const lobby = currLobbies.find((lobby) => lobby.roomCode === "ROOM123");
      assert.isUndefined(lobby, "Lobby was not deleted");
      done();
    });
  });

  it("should keep the lobby when a guest leaves", () => {
    clientSocket1.emit("create_lobby");

    clientSocket1.once("createdLobby", (roomCode) => {
      assert.equal(roomCode, "ROOM123");
      const roomFound = currLobbies.find((room) => room.roomCode === roomCode);
      assert.isNotNull(roomFound, "ROOM123 not found in currLobbies");
    });

    clientSocket2.emit("join_lobby", "ROOM123");

    clientSocket2.once("joinedLobby", (roomCode) => {
      const lobby = currLobbies.find((lobby) => lobby.roomCode === roomCode);
      assert.isNotNull(lobby, "Lobby not found");
    });

    clientSocket2.emit("leave", "ROOM123");

    const lobby = currLobbies.find((lobby) => lobby.roomCode === "ROOM123");
    assert.isNotNull(lobby, "Lobby was deleted");
  });

  it("should send/receive a message and an answer", (done) => {
    clientSocket1.emit("create_lobby");

    clientSocket1.once("createdLobby", (roomCode) => {
      clientSocket2.emit("join_lobby", roomCode);
    });

    clientSocket2.once("joinedLobby", (roomCode) => {
      clientSocket1.emit("sendMessage", { room: roomCode, message: "Hello" });
    });

    clientSocket2.once("receivedMessage", (data) => {
      assert.equal(data.message, "Hello");
    });

    clientSocket2.emit("answerQuestion", "Yes", "ROOM123", "client2");

    clientSocket1.once("receivedAnswer", (answer, author) => {
      assert.equal(answer, "Yes");
      assert.equal(author, "client2");
      done();
    });
  });

  it("should select a card", () => {
    clientSocket1.emit("join_lobby", "TEST");

    clientSocket1.once("joinedLobby", (roomCode) => {
      clientSocket2.emit("join_lobby", roomCode);
    });

    clientSocket2.emit("selectCard", { isHost: false, room: "TEST" });

    clientSocket1.once("selectCard", () => {
      const lobby = currLobbies.find((lobby) => lobby.roomCode === "TEST");
      assert.isNotNull(lobby, "lobby not found !");
      assert.equal(
        lobby.guestHasSelected,
        true,
        "Guest has not selected a card",
      );

      clientSocket1.emit("selectCard", { isHost: true, room: lobby.roomCode });

      const updatedLobby = currLobbies.find(
        (lobby) => lobby.roomCode === "TEST",
      );
      assert.isNotNull(
        updatedLobby,
        "lobby not found ! (after host selection)",
      );
      assert.equal(
        updatedLobby.hostHasSelected,
        true,
        "Host has not selected a card",
      );
    });
  });

  it("should set a new difficulty", (done) => {
    clientSocket1.emit("create_lobby", "TEST");

    clientSocket1.once("createdLobby", (roomCode) => {
      clientSocket2.emit("join_lobby", roomCode);
    });

    clientSocket2.once("joinedLobby", (roomCode) => {
      clientSocket1.emit("settingDifficulty", {
        difficulty: 1,
        room: roomCode,
      });
    });

    const lobby = currLobbies.find((lobby) => lobby.roomCode === "TEST");
    clientSocket1.once("finishedUpdatingDifficulty", (data) => {
      const newData = data.difficulty;
      assert.equal(newData, 1);
    });

    done();
  });

  it("should set a new theme", (done) => {
    clientSocket1.emit("create_lobby", "TEST");

    clientSocket1.once("createdLobby", (roomCode) => {
      clientSocket2.emit("join_lobby", roomCode);
    });

    clientSocket2.once("joinedLobby", (roomCode) => {
      clientSocket1.emit("settingTheme", { theme: 1, room: roomCode });
    });

    const lobby = currLobbies.find((lobby) => lobby.roomCode === "TEST");
    clientSocket1.once("finishedUpdatingTheme", (data) => {
      const newData = data.theme;
      assert.equal(newData, 1);
    });
    done();
  });

  it("should set a new number of guesses", (done) => {
    clientSocket1.emit("create_lobby", "TEST");

    clientSocket1.once("createdLobby", (roomCode) => {
      clientSocket2.emit("join_lobby", roomCode);
    });

    clientSocket2.once("joinedLobby", (roomCode) => {
      clientSocket1.emit("settingNumberOfGuesses", {
        numGuesses: 3,
        room: roomCode,
      });
    });

    const lobby = currLobbies.find((lobby) => lobby.roomCode === "TEST");
    clientSocket1.once("finishedUpdatingGuesses", (data) => {
      const newData = data.numGuesses;
      assert.equal(newData, 3);
    });
    done();
  });

  it("should set a new grid size", (done) => {
    clientSocket1.emit("create_lobby", "TEST");

    clientSocket1.once("createdLobby", (roomCode) => {
      clientSocket2.emit("join_lobby", roomCode);
    });

    clientSocket2.once("joinedLobby", (roomCode) => {
      clientSocket1.emit("settingGridsize", { gridSize: 20, room: roomCode });
    });

    const lobby = currLobbies.find((lobby) => lobby.roomCode === "TEST");
    clientSocket1.once("finishedUpdatingGridSize", (data) => {
      const newData = data.gridSize;
      assert.equal(newData, 20);
    });
    done();
  });

  it("should finalize a guess", (done) =>{
    clientSocket1.emit("create_lobby", "TEST");

    clientSocket1.once("createdLobby", (roomCode) => {
      clientSocket2.emit("join_lobby", roomCode);
    });

    clientSocket2.once("joinedLobby", (roomCode) => {
      clientSocket1.emit("finalizedGuess");
    });
    clientSocket2.emit("finalizedGuess");
    done();
  });

  it("should cancel a guess", (done) =>{
    clientSocket1.emit("create_lobby", "TEST");

    clientSocket1.once("createdLobby", (roomCode) => {
      clientSocket2.emit("join_lobby", roomCode);
    });

    clientSocket2.once("joinedLobby", (roomCode) => {
      clientSocket1.emit("cancelledGuess");
    });
    clientSocket2.emit("cancelledGuess");
    done();
  });

  
});
