"use client";

import React, { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Home from "../page.jsx";
import { socket } from "@/utils/socket";
// import userRooms from ".../server/index.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Lobby = ({ room }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [playersInLobby, setPlayerCount] = useState(0);
  const [boardDifficulty, setDifficulty] = useState(0);
  const [boardTheme, setTheme] = useState(1);
  const [numGuess, setNumOfGuesses] = useState(1);
  const [gridSize, setGridSize] = useState(16);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("createdLobby", () => {
      setPlayerCount((playersInLobby) => playersInLobby + 1);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("joinedLobby", () => {
      setPlayerCount((playersInLobby) => playersInLobby + 1);
    });
  });

  // sends update signals to server when button is clicked
  // @ts-expect-error - TS complains about the type of newDiff, but we alr know it's a number
  const onDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    socket.emit("settingDifficulty", boardDifficulty);
  };
  // @ts-expect-error - TS complains about the type of newTheme, but we alr know it's a number
  const onThemeChange = (newTheme) => {
    setTheme(newTheme);
    socket.emit("settingTheme", boardTheme);
  };
  // @ts-expect-error - TS complains about the type of newNumGuesses, but we alr know it's a number
  const onNumGuessChange = (newNumGuesses) => {
    setNumOfGuesses(newNumGuesses);
    socket.emit("settingNumberOfGuesses", numGuess);
  };
  // @ts-expect-error - TS complains about the type of newGridSize, but we alr know it's a number
  const onGridChange = (newGridSize) => {
    setGridSize(newGridSize);
    socket.emit("settingGridSize", gridSize);
  };

  // difficulty handlers
  const handleClickEasy = () => {
    onDifficultyChange(0);
  };

  const handleClickMedium = () => {
    onDifficultyChange(1);
  };

  const handleClickHard = () => {
    onDifficultyChange(2);
  };

  // theme handlers
  const handleClickThemeResAndDining = () => {
    onThemeChange(0);
  };

  const handleClickThemeCampusLandmarks = () => {
    onThemeChange(1);
  };

  const handleClickThemeStudySpots = () => {
    onThemeChange(2);
  };

  const handleClickThemeBikeRacks = () => {
    onThemeChange(3);
  };

  const handleClickThemeStreetsAndParking = () => {
    onThemeChange(4);
  };

  // guess handlers (will probably convert to dropdown menu)
  const handleClickGuess1 = () => {
    onNumGuessChange(1);
  };

  const handleClickGuess3 = () => {
    onNumGuessChange(3);
  };

  // board size handlers (will probably convert this to dropdown as well)
  const handleClickBoardSmall = () => {
    onGridChange(16);
  };

  const handleClickBoardLarge = () => {
    onGridChange(20);
  };

  return (
    <div>
      <br></br>
      <p>Set your difficulty:</p>
      <button onClick={handleClickEasy}> Easy </button>
      <br></br>
      <button onClick={handleClickMedium}> Medium </button>
      <br></br>
      <button onClick={handleClickHard}> Hard </button>

      <br></br>
      <p>Select a theme:</p>
      <button onClick={handleClickThemeResAndDining}>
        {" "}
        Residential and Dining{" "}
      </button>
      <br></br>
      <button onClick={handleClickThemeCampusLandmarks}>
        {" "}
        Campus Landmarks{" "}
      </button>
      <br></br>
      <button onClick={handleClickThemeStudySpots}> Study Spots </button>
      <br></br>
      <button onClick={handleClickThemeBikeRacks}> Bike Racks </button>
      <br></br>
      <button onClick={handleClickThemeStreetsAndParking}>
        {" "}
        Streets and Parking Lots{" "}
      </button>

      <br></br>
      <p>How many guesses?</p>
      <button onClick={handleClickGuess1}> 1 guess </button>
      <br></br>
      <button onClick={handleClickGuess3}> 3 guesses </button>

      <br></br>
      <p>Set your board size:</p>
      <button onClick={handleClickBoardSmall}> 4 x 4 </button>
      <br></br>
      <button onClick={handleClickBoardLarge}> 5 x 4 </button>
    </div>
  );
};

// try to change guess select to dropdown menu instead.
// for commit
export default Lobby;

// import { User } from "./User";

// // 4x4 = 20
// // 5x5 = 25
// // 4 = 4x4
// // 5 = 5x5
// // 46 = 4x6
// // board theme is string or int?

// // include tests

// class Lobby {
//   //defining variable types
//   hostID: string;
//   guestID: string;
//   playersInLobby: string[] = [];
//   code: string;
//   gridSize: { width: number; height: number };
//   boardDifficulty: number;
//   boardTheme: number;
//   numGuess: number;

//   constructor(
//     user: User,
//     code: string,
//     gridSize = { width: 4, height: 4 },
//     boardDiff = 0,
//     boardTheme = 0,
//     numGuess = 1,
//   ) {
//     this.hostID = user.id;
//     this.guestID = ""; // null on default
//     this.playersInLobby.push(user.id);
//     this.code = code;
//     this.gridSize = gridSize;
//     this.boardDifficulty = boardDiff;
//     this.boardTheme = boardTheme;
//     this.numGuess = numGuess;
//   }

//   joinGame(newUser: User, code: string) {
//     if (code !== this.code) {
//       throw new Error("Invalid code.");
//     }

//     if (this.getNumPlayers() >= 2) {
//       throw new Error("Lobby is full.");
//     }

//     if (this.playersInLobby.includes(newUser.id)) {
//       throw new Error(`User ${newUser.id} is already in the lobby.`);
//     }

//     this.playersInLobby.push(newUser.id);
//     this.guestID = newUser.id;
//   }

//   static hostGame(user: User, code: string) {
//     return new Lobby(user, code);
//   }

//   getHostID() {
//     return this.hostID;
//   }

//   getGuestID() {
//     return this.guestID;
//   }

//   getCurrPlayers() {
//     return this.playersInLobby;
//   }

//   getNumPlayers() {
//     return this.playersInLobby.length;
//   }

//   setGridSize(width: number, height: number) {
//     this.gridSize = { width, height };
//   }

//   getGridSize() {
//     return this.gridSize;
//   }

//   setBoardDiff(boardDiff: number) {
//     this.boardDifficulty = boardDiff;
//   }

//   getBoardDiff() {
//     return this.boardDifficulty;
//   }

//   setBoardTheme(boardTheme: number) {
//     this.boardTheme = boardTheme;
//   }

//   getBoardTheme() {
//     return this.boardTheme;
//   }

//   setNumGuess(numGuess: number) {
//     this.numGuess = numGuess;
//   }

//   getNumGuess() {
//     return this.numGuess;
//   }
// }
