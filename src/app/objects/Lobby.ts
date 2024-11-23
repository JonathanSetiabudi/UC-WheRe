;import { User } from "./User";

// 4x4 = 20
// 5x5 = 25
// 4 = 4x4
// 5 = 5x5
// 46 = 4x6
// board theme is string or int?

// include tests

class Lobby {
  //defining variable types
  hostID: string;
  guestID: string;
  playersInLobby: string[] = [];
  code: string;
  gridSize: { width: number; height: number };
  boardDifficulty: number;
  boardTheme: number;
  numGuess: number;

  constructor(
    user: User,
    code: string,
    gridSize = { width: 4, height: 4 },
    boardDiff = 0,
    boardTheme = 0,
    numGuess = 1,
  ) {
    this.hostID = user.id;
    this.guestID = ""; // null on default
    this.playersInLobby.push(user.id);
    this.code = code;
    this.gridSize = gridSize;
    this.boardDifficulty = boardDiff;
    this.boardTheme = boardTheme;
    this.numGuess = numGuess;
  }

  joinGame(newUser: User, code: string) {
    if (code !== this.code) {
      throw new Error("Invalid code.");
    }

    if (this.getNumPlayers() >= 2) {
      throw new Error("Lobby is full.");
    }

    if (this.playersInLobby.includes(newUser.id)) {
      throw new Error(`User ${newUser.id} is already in the lobby.`);
    }

    this.playersInLobby.push(newUser.id);
    this.guestID = newUser.id;
  }

  static hostGame(user: User, code: string) {
    return new Lobby(user, code);
  }

  getHostID() {
    return this.hostID;
  }

  getGuestID() {
    return this.guestID;
  }

  getCurrPlayers() {
    return this.playersInLobby;
  }

  getNumPlayers() {
    return this.playersInLobby.length;
  }

  setGridSize(width: number, height: number) {
    this.gridSize = { width, height };
  }

  getGridSize() {
    return this.gridSize;
  }

  setBoardDiff(boardDiff: number) {
    this.boardDifficulty = boardDiff;
  }

  getBoardDiff() {
    return this.boardDifficulty;
  }

  setBoardTheme(boardTheme: number) {
    this.boardTheme = boardTheme;
  }

  getBoardTheme() {
    return this.boardTheme;
  }

  setNumGuess(numGuess: number) {
    this.numGuess = numGuess;
  }

  getNumGuess() {
    return this.numGuess;
  }
}
