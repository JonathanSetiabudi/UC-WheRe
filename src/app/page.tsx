"use client";

import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import Messages from "./messages/page";
import Image from "next/image";
import Orange from "../../public/assets/orange.svg";
import Scotty from "../../public/assets/bear.svg";
import Norm from "../../public/assets/norm.svg";
import Game from "../app/game/page";
import Lobby from "./Lobby/page";
import Location from "./objects/Location";

const initialCards: Location[] = [];
// initialize gameCards
for (let i = 0; i < 20; i++) {
  const card = new Location(
    `Location ${i + 1}`,
    `Description ${i + 1}`,
    `image${i + 1}.jpg`,
    "Default",
  );
  initialCards.push(card);
}

export default function Home() {
  socket.connect();

  //react states for username and room
  const [gameBoard, setGameBoard] = useState(initialCards);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showLobby, setShowLobby] = useState<boolean>(false);
  const [showGame, setShowGame] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [lobbyIsFull, setLobbyIsFull] = useState<boolean>(false);
  const [lobbyNotExistent, setLobbyNotExistent] = useState<boolean>(false);
  const [isEmptyUsername, setIsEmptyUsername] = useState<boolean>(false);
  const [isHost, setIsHost] = useState<boolean>(false);
  // const [gridSize, setGridSize] = useState<number>(16);
  // const [numGuesses, setNumGuesses] = useState<number>(1);
  useEffect(() => {
    socket.connect();

    socket.on("createdLobby", (data) => {
      setRoom(data);
      setIsHost(true);
    });

    socket.on("joinedLobby", (data) => {
      setRoom(data);
      setShowLobby(true);
      setLobbyIsFull(true);
    });

    socket.on("hostLeft", () => {
      leave();
    });

    socket.on("guestLeftMidGame", () => {
      leave();
    });

    socket.on("triedJoinFullLobby", () => {
      setShowErrorModal(true);
      // setLobbyIsFull(true);
    });

    socket.on("triedJoinNonExistentLobby", () => {
      setShowErrorModal(true);
      setLobbyNotExistent(true);
    });

    socket.on("successStartGame", () => {
      setShowGame(true);
    });

    socket.on("failStartGame", () => {
      setShowErrorModal(true);
    });

    socket.on("updateGameBoard", (data) => {
      setGameBoard(data);
    });

    return () => {
      setLobbyIsFull(false);

      socket.emit("leave", room);

      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // @ts-expect-error - TS complains about the type of e, but don't worry about it
  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // @ts-expect-error - TS complains about the type of e, but don't worry about it
  const onRoomChange = (e) => {
    setRoom(e.target.value.toUpperCase());
  };

  const joinLobby = () => {
    if (username.trim() !== "" && room !== "") {
      socket.emit("join_lobby", room);
    } else if (username.trim() === "") {
      setIsEmptyUsername(true);
      setShowErrorModal(true);
    }
  };

  const createLobby = () => {
    if (username.trim() === "") {
      setIsEmptyUsername(true);
      setShowErrorModal(true);
    } else {
      socket.emit("create_lobby");
      setShowLobby(true);
    }
  };

  const doStartGame = () => {
    socket.emit("tryStartGame", room);
  };

  // leave modal caused by homepage errors
  const leaveError = () => {
    setShowErrorModal(false);
    // setRoom(null);
    // setLobbyIsFull(false);
    setLobbyNotExistent(false);
    setIsEmptyUsername(false);
  };

  const leave = () => {
    setIsHost(false);
    setShowLobby(false);
    setShowGame(false);
    socket.emit("leave", room);
  };

  const buttonPerms = (checkIfHost: boolean) => {
    return checkIfHost
      ? "text-black hover:bg-blue-200"
      : "text-gray-400 cursor-not-allowed";
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#FFF8D2";
  }, []);

  return (
    <div className="Home">
      {!showLobby ? (
        <div className="flex flex-col items-center font-jersey">
          <div className="mb-7 text-center text-7xl text-ucwhere-blue">
            UC WheRe?
            <br />
          </div>
          <a
            href="http://localhost:3000"
            target="_blank"
            data-test="new-tab-button"
          >
            New Tab for Testing
          </a>
          <br />
          <input
            className="mb-1 rounded-md p-2 text-black"
            type="text"
            placeholder="Username"
            onChange={onUsernameChange}
            data-test="username-input"
          />

          <button
            className="mb-5 text-xl text-ucwhere-light-blue enabled:hover:text-ucwhere-blue"
            onClick={createLobby}
          >
            Create a Lobby
          </button>
          <input
            className="mb-1 rounded-md p-2 text-black"
            type="text"
            placeholder="Enter Lobby ID"
            onChange={onRoomChange}
            data-test="lobby-input"
          />

          <button
            className="mb-3 text-xl text-ucwhere-light-blue enabled:hover:text-ucwhere-blue"
            data-test="join-lobby-button"
            onClick={joinLobby}
          >
            Join a Lobby
          </button>
          <div className="grid grid-cols-2 gap-5 p-10">
            <Image src={Scotty} width="230" height="230" alt="Scotty" />
            {/* <Image src={Orange} alt="Orange" /> */}
            <Image src={Norm} width="200" height="200" alt="norm" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-5 font-jersey text-white">
          <div className="rounded-lg bg-ucwhere-orange p-2 text-2xl">
            Room: {room}
          </div>
          <a
            href="http://localhost:3000"
            target="_blank"
            data-test="new-tab-button"
          >
            New Tab for Testing
          </a>
          {showGame ? (
            <div>
              <Messages
                data-test="messaging-component"
                username={username}
                room={room}
                isHost={isHost}
              />
              <Game room={room} gameBoard={gameBoard} />
            </div>
          ) : (
            <div>
              <Lobby room={room} isHost={isHost} />

              <br></br>

              <button
                className="m-2 rounded-md bg-ucwhere-red p-2 text-2xl text-ucwhere-light-blue text-white hover:bg-rose-500"
                data-test="leave-button"
                onClick={leave}
              >
                Leave
              </button>

              {/* <br></br> */}

              <button
                className={`${buttonPerms(isHost)} rounded-md bg-ucwhere-green p-2 text-2xl text-white hover:bg-emerald-500`}
                disabled={!isHost}
                onClick={doStartGame}
              >
                Start Game
              </button>
            </div>
          )}
        </div>
      )}

      {showErrorModal && (
        <div
          className="rounded-lg border-2 border-gray-700 bg-ucwhere-blue p-6 font-jersey text-lg text-gray-800 text-white"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          {lobbyIsFull && <p>Lobby you are attempting to join is full.</p>}
          {lobbyNotExistent && (
            <p>Lobby you are attempting to join is non-existent.</p>
          )}
          {isEmptyUsername && <p>You must input a username to play.</p>}
          {showLobby && !lobbyIsFull && (
            <p>Not enough players to start game.</p>
          )}

          <div>
            <button
              className="mt-2 rounded-lg bg-ucwhere-red px-3 py-1 text-white hover:bg-rose-500"
              onClick={leaveError}
              style={
                {
                  // padding: "10px 20px",
                  // backgroundColor: "#32426d",
                  // border: "1px solid black",
                  // borderRadius: "5px",
                }
              }
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
