"use client";

import React, { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Home from "../page.jsx";
import { socket } from "@/utils/socket";
// import userRooms from ".../server/index.js";
// @ts-expect-erro - TS complains about the type of newTheme, but we alr know it's a string
// had to mispell error ^ bcs there was a weird error saying it was unused

const Lobby = (props) => {
  

  // let initialCards: Location[] = [];
  // // initialize gameCards

  // for (let i = 0; i < 16; i++) {
  //   const card = new Location(
  //     locationNames[i],
  //     descriptions[i],
  //     filePaths[i],
  //     "Residential and Dining",
  //   );
  //   initialCards.push(card);
  // }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars


  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return () => {
      // Cleanup event listeners when component unmounts
      socket.off("updatingGameBoard");
    };
  }, []);

  // sends update signals to server when button is clicked
  // const onDifficultyChange = (newDifficulty) => {
  //   setDifficulty(newDifficulty);
  //   const data = { room: props.room, boardDifficulty: newDifficulty };
  //   socket.emit("settingDifficulty", data);
  // };


  // @ts-expect-error - TS complains about the type of newTheme, but we alr know it's a number
  const onThemeChange = (newTheme) => {
    const data = {
      room: props.room,
      boardTheme: newTheme
    };
    socket.emit("settingTheme", data);
  };
  // @ts-expect-error - TS complains about the type of newNumGuesses, but we alr know it's a number
  const onNumGuessChange = (newNumGuesses) => {
    const data = { room: props.room, numGuess: newNumGuesses };
    socket.emit("settingNumberOfGuesses", data);
  };
  // @ts-expect-error - TS complains about the type of newGridSize, but we alr know it's a number
  const onGridChange = (newGridSize) => {
    const data = {
      room: props.room,
      gridSize: newGridSize,
    };
    socket.emit("settingGridSize", data);
  };

  const testEcho = () => {
    const data = { room: props.room };
    socket.emit("testEcho", data);
  };

  // // difficulty handlers
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleClickEasy = () => {
  //   onDifficultyChange(0);
  // };
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleClickMedium = () => {
  //   onDifficultyChange(1);
  // };
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleClickHard = () => {
  //   onDifficultyChange(2);
  // };

  // theme handlers
  // const [active, setActive] = useState('b1');
  // const [buttonColor, setButtonColor] = useState('blue-900');

  // const toggleButtonColor = () => {
  //   // Toggle between two colors, e.g., blue and green
  //   setButtonColor((prevColor) => (prevColor === 'blue-900' ? 'green-900' : 'blue-900'));
  // };

  const handleClickThemeResAndDining = () => {
    onThemeChange(0);
    // setActive('b1');
  };

  const handleClickThemeCampusLandmarks = () => {
    onThemeChange(1);
  };
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleClickThemeStudySpots = () => {
  //   onThemeChange(2);
  // };
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleClickThemeBikeRacks = () => {
  //   onThemeChange(3);
  // };
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleClickThemeStreetsAndParking = () => {
  //   onThemeChange(4);
  // };

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

  const buttonPerms = (checkIfHost: boolean) => {
    return checkIfHost
      ? "bg-ucwhere-light-blue p-2 m-0.5 rounded-md text-white hover:text-ucwhere-blue"
      : "bg-ucwhere-light-blue p-2 m-0.5 rounded-md text-white cursor-not-allowed";
  };

  const handleTestEcho = () => {
    testEcho();
  };

  return (
    <div>
      {/* <br></br>

      <p>Set your difficulty:</p>

      <button
        onClick={handleClickEasy}
        disabled={!isHost}
        className={buttonPerms(isHost)}
      >
        Easy
      </button>

      <br></br>

      <button
        onClick={handleClickMedium}
        disabled={!isHost}
        className={buttonPerms(isHost)}
      >
        Medium
      </button>

      <br></br>

      <button
        onClick={handleClickHard}
        disabled={!isHost}
        className={buttonPerms(isHost)}
      >
        Hard
      </button> */}

      {/* <br></br> */}
      <div className="mb-2">
        <p className="text-xl text-gray-800">Select a theme:</p>

        <button
          onClick={handleClickThemeResAndDining}
          disabled={!props.isHost}
          className={`${buttonPerms(props.isHost)}`}
          style={{}}
        >
          {" "}
          Residential and Dining{" "}
        </button>

        <br></br>

        <button
          onClick={handleClickThemeCampusLandmarks}
          disabled={!props.isHost}
          className={`${buttonPerms(props.isHost)}`}
        >
          {" "}
          Campus Landmarks{" "}
        </button>
      </div>
      {/* <br></br>

      <button
        onClick={handleClickThemeStudySpots}
        disabled={!isHost}
        className={buttonPerms(isHost)}
      >
        Study Spots
      </button>

      <br></br>

      <button
        onClick={handleClickThemeBikeRacks}
        disabled={!isHost}
        className={buttonPerms(isHost)}
      >
        Bike Racks
      </button>

      <br></br>

      <button
        onClick={handleClickThemeStreetsAndParking}
        disabled={!isHost}
        className={buttonPerms(isHost)}
      >
        {" "}
        Streets and Parking Lots{" "}
      </button> */}

      {/* <br></br> */}
      <div className="mb-2">
        <p className="text-xl text-gray-800">How many guesses?</p>

        <button
          onClick={handleClickGuess1}
          disabled={!props.isHost}
          className={`${buttonPerms(props.isHost)}`}
        >
          1 guess
        </button>

        {/* <br></br> */}

        <button
          onClick={handleClickGuess3}
          disabled={!props.isHost}
          className={`${buttonPerms(props.isHost)}`}
        >
          3 guesses
        </button>
      </div>
      {/* <br></br> */}

      <p className="text-xl text-gray-800">Set your board size:</p>

      <button
        onClick={handleClickBoardSmall}
        disabled={!props.isHost}
        className={`${buttonPerms(props.isHost)}`}
      >
        4 x 4
      </button>

      {/* <br></br> */}

      <button
        onClick={handleClickBoardLarge}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        5 x 4
      </button>
      <br></br>
      <p>tester button for lobby settings:</p>

      {/* <br></br> */}
      <button onClick={handleTestEcho}>click for echo !</button>
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
