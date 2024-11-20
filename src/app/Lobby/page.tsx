"use client";

import React, { Component, useEffect, useState } from 'react';
import Home from "../page.jsx";
import { socket } from '@/utils/socket';
import userRooms from '.../server/index.js';

const Lobby = ({code}) => {
    // const [code, setCode] = useState(code);
    const [playersInLobby, setPlayerCount] = useState(0);
    const [boardDifficulty, setDifficulty] = useState(0);
    const [boardTheme, setTheme] = useState(0);
    const [numGuess, setNumOfGuesses] = useState(1);

    useEffect(() => {
            socket.on("createdLobby", (room) => {
                setPlayerCount(playersInLobby => playersInLobby + 1);
                }
            )
            socket.on("joinedLobby", (room) => {
                setPlayerCount(playersInLobby => playersInLobby + 1);
                }
            )
        }
    )

    const onDifficultyChange = (newDifficulty) =>{
        setDifficulty(newDifficulty);
        socket.emit("settingDifficulty", boardDifficulty);
    }

    const onThemeChange = (newTheme) =>{
        setTheme(newTheme);
        socket.emit("settingTheme", boardTheme);
    }

    const onNumGuessChange = (newNumGuesses) => {
        setNumOfGuesses(newNumGuesses);
        socket.emit("settingNumberOfGuesses", numGuess);
    }

    const handleClickEasy = (event: React.MouseEvent<HTMLButtonElement>) => {
        onDifficultyChange(0);
    }

    const handleClickMedium = (event: React.MouseEvent<HTMLButtonElement>) => {
        onDifficultyChange(1);
    }

    const handleClickHard = (event: React.MouseEvent<HTMLButtonElement>) => {
        onDifficultyChange(2);
    }

    return (
        <div>
            <button onClick={handleClickEasy}> Easy </button>
            <button onClick={handleClickMedium}> Medium </button>
            <button onClick={handleClickHard}> Hard </button>
        </div>

    )
}

export default Lobby;
