import { createServer } from "node:http";
import { io as ioc } from "socket.io-client";
import { Server } from "socket.io";
import { assert } from "chai";

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
});
