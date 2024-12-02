import { createServer } from "node:http";
import { io as ioc } from "socket.io-client";
import { Server } from "socket.io";
import { assert } from "chai";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function waitFor(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("Game Tests", () => {
  let io, serverSocket, clientSocket1, clientSocket2;

  before((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket1 = ioc(`http://localhost:${port}`);
      clientSocket2 = ioc(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket1.on("connect", done);
    });
  });

  after(() => {
    io.close();
    clientSocket1.disconnect();
  });
  
  it("should create a lobby", (done) => {
    let currLobbies = [
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

    clientSocket1.emit("create_lobby");

    serverSocket.on("create_lobby", () => {
      const roomCode = "ROOM123";
      const room = {
        roomCode: roomCode,
        players: [serverSocket.id],
        numOfUsers: 1,
        difficulty: 0,
        theme: 0,
        numGuesses: 1,
        gridSize: 16,
      };
      currLobbies.push(room);
      serverSocket.join(roomCode);
      serverSocket.emit("createdLobby", roomCode);
    });

    clientSocket1.on("createdLobby", (roomCode) => {
      assert.equal(roomCode, "ROOM123");
      done();
    });
  });
  //--------------------------------------------------------------------------------------------------
  it("should join a lobby", () => {
    let currLobbies = [
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
    clientSocket1.emit("join_lobby", "TEST");

    serverSocket.on("join_lobby", (room) => {
        if (currLobbies.find((lobby) => lobby.roomCode === room)) {
            if (currLobbies.find((lobby) => lobby.roomCode === room).numOfUsers < 2) {
              currLobbies.find((lobby) => lobby.roomCode === room).numOfUsers++;
              serverSocket.join(room);
              currLobbies
                .find((roomToBeFound) => roomToBeFound.roomCode === room)
                .players.push(clientSocket1.id);
              serverSocket.emit("joinedLobby", room);
            } else {
              clientSocket1.to(room).emit("triedJoinFullLobby");
            }
        } else {
            serverSocket.to(room).emit("triedJoinNonExistentLobby");
        }
    });

    clientSocket1.on("joinedLobby", (room) => {
      assert.equal(room, "TEST");
    });
  });
  //--------------------------------------------------------------------------------------------------
  it("should send and receive messages", () => {
    let currLobbies = [
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

    clientSocket1.emit("join_lobby", "TEST");

    serverSocket.on("join_lobby", (room) => {
        if (currLobbies.find((lobby) => lobby.roomCode === room)) {
            if (currLobbies.find((lobby) => lobby.roomCode === room).numOfUsers < 2) {
              currLobbies.find((lobby) => lobby.roomCode === room).numOfUsers++;
              serverSocket.join(room);
              currLobbies
                .find((roomToBeFound) => roomToBeFound.roomCode === room)
                .players.push(clientSocket1.id);
              serverSocket.emit("joinedLobby", room);
            } else {
              serverSocket.to(room).emit("triedJoinFullLobby");
            }
        } else {
            serverSocket.to(room).emit("triedJoinNonExistentLobby");
        }
    });

    clientSocket1.emit("sendMessage", { room: "TEST", author:"Tester", message: "Hello", received: false });

    serverSocket.on("sendMessage", (data) => {
        serverSocket.to(data.room).emit("receivedMessage", data);
    });

    clientSocket1.on("receivedMessage", (data) => {
      assert.equal(data.room, "TEST");
      assert.equal(data.message, "Hello");
    });
  });
  //--------------------------------------------------------------------------------------------------
  it("should handle flag toggling", (done) => {
    clientSocket1.emit("flagToggled", true);

    serverSocket.on("flagToggled", (toggleState) => {
      assert.isTrue(toggleState);
      done();
    });
  });
  //--------------------------------------------------------------------------------------------------
  it("should handle card clicks with flag", (done) => {
    clientSocket1.emit("cardClickedWithFlag", true);

    serverSocket.on("cardClickedWithFlag", (isFlaggingMode) => {
      assert.isTrue(isFlaggingMode);
      done();
    });
  });
  //--------------------------------------------------------------------------------------------------
  it("should handle finalized guesses", (done) => {
    clientSocket1.emit("finalizedGuess");

    serverSocket.on("finalizedGuess", () => {
      done();
    });
  });
  //--------------------------------------------------------------------------------------------------
  it("should handle cancelled guesses", (done) => {
    clientSocket1.emit("cancelledGuess");

    serverSocket.on("cancelledGuess", () => {
      done();
    });
  });
  //--------------------------------------------------------------------------------------------------
  it("should update settings", (done) => {
    clientSocket1.emit("settingDifficulty", 3);

    serverSocket.on("settingDifficulty", (difficulty) => {
      assert.equal(difficulty, 3);
      done();
    });
  });
});