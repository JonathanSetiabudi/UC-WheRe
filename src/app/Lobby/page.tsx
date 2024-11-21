"use client";

import React, { Component, useEffect, useState } from "react";
import Home from "../page.jsx";
import { socket } from "@/utils/socket";
import userRooms from ".../server/index.js";

const Lobby = ({ code }) => {
  // const [code, setCode] = useState(code);
  const [playersInLobby, setPlayerCount] = useState(0);
  const [boardDifficulty, setDifficulty] = useState(0);
  const [boardTheme, setTheme] = useState(1);
  const [numGuess, setNumOfGuesses] = useState(1);
  const [gridSize, setGridSize] = useState(16);

  useEffect(() => {
    socket.on("createdLobby", (room) => {
      setPlayerCount((playersInLobby) => playersInLobby + 1);
    });
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
  const handleClickEasy = (event: React.MouseEvent<HTMLButtonElement>) => {
    onDifficultyChange(0);
  };

  const handleClickMedium = (event: React.MouseEvent<HTMLButtonElement>) => {
    onDifficultyChange(1);
  };

  const handleClickHard = (event: React.MouseEvent<HTMLButtonElement>) => {
    onDifficultyChange(2);
  };

  // theme handlers
  const handleClickThemeResAndDining = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onThemeChange(0);
  };

  const handleClickThemeCampusLandmarks = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onThemeChange(1);
  };

  const handleClickThemeStudySpots = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onThemeChange(2);
  };

  const handleClickThemeBikeRacks = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onThemeChange(3);
  };

  const handleClickThemeStreetsAndParking = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onThemeChange(4);
  };

  // guess handlers (will probably convert to dropdown menu)
  const handleClickGuess1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    onNumGuessChange(1);
  };

  const handleClickGuess3 = (event: React.MouseEvent<HTMLButtonElement>) => {
    onNumGuessChange(3);
  };

  // board size handlers (will probably convert this to dropdown as well)
  const handleClickBoardSmall = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onGridChange(16);
  };

  const handleClickBoardLarge = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
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

export default Lobby;
