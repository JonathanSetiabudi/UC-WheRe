"use client";

import React, { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Home from "../page.jsx";
import { socket } from "@/utils/socket";
import {LocationClass} from "@/objects/Location";
// import userRooms from ".../server/index.js";
// @ts-expect-error - TS complains about the type of newTheme, but we alr know it's a string
const Lobby = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [playersInLobby, setPlayerCount] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [boardDifficulty, setDifficulty] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [boardTheme, setTheme] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [numGuess, setNumOfGuesses] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gridSize, setGridSize] = useState<number>(16);

  const locationNames = ["Aberdeen Inverness", "Dundee B", "Pentland Dorms", "Glen Mor Apartments", "North District", "Bannockburn Village", "International Village", "Glascow", "Lothian Dining", "Glen Mor Pool", "Dundee Study Rooms", "AI Lounge", "West Lothian", "Dundee A", "Dundee Gym", "East Lothian Lawn", "Scotty's(Glen Mor)", "HUB", "The Barn", "The Habit", "Coffee Bean", "Getaway Cafe", "Scotty's(ASPB)", "Scotty's(Glascow)", "Bytes", "Emerbee's", "Ivan's", "Noods","Scotty Statue", "Clock Tower", "Barnes and Noble", "SRC", "UCR Sign", "UCPD", "Bournes Hall", "HUMMS", "SSC", "CHASS North", "CHASS South", "Arts Building", "University Theatre", "ULH", "Pierce Hall", "Skye Hall", "Career Center", "AI Bowl", "Stats Building"];

  const filePaths = ["./images/AI_BUILDINGS.HEIC", "./images/DUNDEE_B.HEIC", "./images/PENTLANDHILLS.HEIC", "./images/GLENMOR.JPG", "./images/NORTHDISTRICT.HEIC", "./images/BANNOCKBURN_SIGN.HEIC", "./images/INTERNATIONALVILLAGE.JPG", "./images/GLASCOW.HEIC", "./images/LOTHIAN_RESTAURANT.JPG", "./images/GLENMOR_POOL.HEIC", "./images/DUNDEE_STUDYROOM.JPG", "./images/AI_LOUNGE.JPG", "./images/WEST_LO.JPG", "./images/DUNDEE_A.HEIC", "./images/DUNDEEGYM.JPG", "./images/EASTLO_LAWN", "./images/SCOTTYS_GLENMOR.JPG", "./images/NIGHTHUB.JPG", "./images/THEBARN_DAYTIME.HEIC", "./images/HABIT.JPG", "./images/COFFEEBEAN.JPG", "./images/GETAWAYCAFE.JPG", "./images/ASPB_SCOTTYS.JPG", "./images/SCOTTYS_GLASCOW.JPG", "./images/BYTES.JPG", "./images/EMERBEES.HEIC", "./images/IVANS.HEIC", "./images/NOODS.JPG", "./images/SCOTTY_STATUE.HEIC", "./images/BELLTOWER.HEIC", "./images/BARNES_AND_NOBLE.HEIC", "./images/SRC.HEIC", "./images/UCRSIGN.JPG", "./images/POLICE_DEPARTMENT.HEIC", "./images/BOURNES_HALL.HEIC", "./images/HUMSS.HEIC", "./images/SSC.HEIC", "./images/CHASS_N.HEIC", "./images/CHASS_S.HEIC", "./images/ARTS_BUILDING.HEIC", "./images/UNI_THEATRE.HEIC", "./images/UNIVERSITYLECTUREHALL.HEIC", "./images/PIERCE_HALL.HEIC", "./images/SKYE_HALL.HEIC", "./images/CAREER_CENTER.HEIC", "./images/AI_BOWL.JPG", "./images/STATISTICS.HEIC"];

  let locationMasterArray = [];

  for (let i = 0; i < 28; i++) {
    const location = new LocationClass(locationNames[i], "description", filePaths[i], "Residential and Dining");
    locationMasterArray.push(location);
  }

  for (let j = 28; j < filePaths.length; j++) {
    const location = new LocationClass(locationNames[j], "description", filePaths[j], "Campus Landmarks");
    locationMasterArray.push(location);
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("createdLobby", () => {
      setPlayerCount((playersInLobby) => playersInLobby + 1);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("joinedLobby", () => {
      setPlayerCount((playersInLobby) => playersInLobby + 1);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("finishedUpdatingDifficulty", (updatedData) => {
      setDifficulty(updatedData.boardDifficulty);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("finishedUpdatingTheme", (updatedData) => {
      setTheme(updatedData.boardTheme);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("finishedUpdatingGuesses", (updatedData) => {
      setNumOfGuesses(updatedData.numGuess);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("finishedUpdatingGridSize", (updatedData) => {
      setGridSize(updatedData.gridSize);
    });
  });

  // sends update signals to server when button is clicked
  // @ts-expect-error - TS complains about the type of newDiff, but we alr know it's a number
  const onDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    const data = { room: props.room, boardDifficulty: newDifficulty };
    socket.emit("settingDifficulty", data);
  };
  // @ts-expect-error - TS complains about the type of newTheme, but we alr know it's a number
  const onThemeChange = (newTheme) => {
    setTheme(newTheme);
    const data = { room: props.room, boardTheme: newTheme };
    socket.emit("settingTheme", data);
  };
  // @ts-expect-error - TS complains about the type of newNumGuesses, but we alr know it's a number
  const onNumGuessChange = (newNumGuesses) => {
    setNumOfGuesses(newNumGuesses);
    const data = { room: props.room, numGuess: newNumGuesses };
    socket.emit("settingNumberOfGuesses", data);
  };
  // @ts-expect-error - TS complains about the type of newGridSize, but we alr know it's a number
  const onGridChange = (newGridSize) => {
    setGridSize(newGridSize);
    const data = { room: props.room, gridSize: newGridSize };
    socket.emit("settingGridSize", data);
  };

  const testEcho = () => {
    const data = { room: props.room };
    socket.emit("testEcho", data);
  };

  // difficulty handlers
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClickEasy = () => {
    onDifficultyChange(0);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClickMedium = () => {
    onDifficultyChange(1);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClickThemeStudySpots = () => {
    onThemeChange(2);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClickThemeBikeRacks = () => {
    onThemeChange(3);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const buttonPerms = (checkIfHost: boolean) => {
    return checkIfHost
      ? "text-black hover:bg-blue-200"
      : "text-gray-400 cursor-not-allowed";
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
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        Easy
      </button>

      <br></br>

      <button
        onClick={handleClickMedium}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        Medium
      </button>

      <br></br>

      <button
        onClick={handleClickHard}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        Hard
      </button> */}

      <br></br>

      <p>Select a theme:</p>

      <button
        onClick={handleClickThemeResAndDining}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        {" "}
        Residential and Dining{" "}
      </button>

      <br></br>

      <button
        onClick={handleClickThemeCampusLandmarks}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        {" "}
        Campus Landmarks{" "}
      </button>

      {/* <br></br>

      <button
        onClick={handleClickThemeStudySpots}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        Study Spots
      </button>

      <br></br>

      <button
        onClick={handleClickThemeBikeRacks}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        Bike Racks
      </button>

      <br></br>

      <button
        onClick={handleClickThemeStreetsAndParking}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        {" "}
        Streets and Parking Lots{" "}
      </button> */}

      <br></br>

      <p>How many guesses?</p>

      <button
        onClick={handleClickGuess1}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        1 guess
      </button>

      <br></br>

      <button
        onClick={handleClickGuess3}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        3 guesses
      </button>

      <br></br>

      <p>Set your board size:</p>

      <button
        onClick={handleClickBoardSmall}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        4 x 4
      </button>

      <br></br>

      <button
        onClick={handleClickBoardLarge}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        5 x 4
      </button>

      <p>tester button for lobby settings:</p>

      <br></br>
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
