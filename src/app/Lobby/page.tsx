"use client";

import React, { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Home from "../page.jsx";
import { socket } from "@/utils/socket";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import userRooms from ".../server/index.js";

const Lobby = ({code}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [playersInLobby, setPlayerCount] = useState(0);
  const [boardDifficulty, setDifficulty] = useState(0);
  const [boardTheme, setTheme] = useState(1);
  const [numGuess, setNumOfGuesses] = useState(1);
  const [gridSize, setGridSize] = useState(16);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("createdLobby", (room) => {
      setPlayerCount((playersInLobby) => playersInLobby + 1);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("joinedLobby", (room) => {
      setPlayerCount((playersInLobby) => playersInLobby + 1);
    });
  });

  // sends update signals to server when button is clicke
  const onDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    socket.emit("settingDifficulty", boardDifficulty);
  };

  const onThemeChange = (newTheme) => {
    setTheme(newTheme);
    socket.emit("settingTheme", boardTheme);
  };

  const onNumGuessChange = (newNumGuesses) => {
    setNumOfGuesses(newNumGuesses);
    socket.emit("settingNumberOfGuesses", numGuess);
  };

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
