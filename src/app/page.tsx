"use client";

import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import Messages from "./messages/page";
import Image from "next/image";
import Orange from "../../public/assets/orange.svg";
import Game from "../app/game/page";
import Lobby from "./Lobby/page";

export default function Home() {
  socket.connect();

  //react states for username and room
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  // @ts-expect-error - TS complains about the type of e, but we don't use it
  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // @ts-expect-error - TS complains about the type of e, but we don't use it
  const onRoomChange = (e) => {
    setRoom(e.target.value.toUpperCase());
  };

  const joinLobby = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_lobby", room);
    }
  };

  const createLobby = () => {
    socket.emit("create_lobby");
    setShowChat(true);
  };

  useEffect(() => {
    socket.connect();

    socket.on("createdLobby", (data) => {
      setRoom(data);
    });

    socket.on("joinedLobby", (data) => {
      setRoom(data);
      setShowChat(true);
    });

    socket.on("lobbyFull", () => {
      alert("Lobby is full");
    });

    socket.on("lobbyNonExistent", () => {
      alert("Lobby does not exist");
    });

    return () => {
      socket.emit("leave", room);

      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { document.body.style.backgroundColor = "#FFF8D2" }, [])

  return (
    <div className="Home">
      {!showChat ? (
        <div className="flex flex-col items-center font-jersey">
          <div className="text-7xl text-ucwhere-blue text-center mb-7">
            UC WheRe?
            <br/>
          </div>
          <a
            href="http://localhost:3000"
            target="_blank"
            data-test="new-tab-button"
          >
            New Tab for Testing
          </a>
          <br />
          <input className="p-2 mb-1 text-black rounded-md"
            type="text"
            placeholder="Username"
            onChange={onUsernameChange}
            data-test="username-input"
          />
            
          <button className = "mb-5 text-xl text-ucwhere-light-blue enabled:hover:text-ucwhere-blue" onClick={createLobby}>Create a Lobby</button>
          <input className="p-2 mb-1 text-black rounded-md"
            type="text"
            placeholder="Enter Lobby ID"
            onChange={onRoomChange}
            data-test="lobby-input"
          />
            
          <button className = "mb-3 text-xl text-ucwhere-light-blue enabled:hover:text-ucwhere-blue" data-test="join-lobby-button" onClick={joinLobby}>Join a Lobby</button>
          <Image src={Orange} alt="Orange"/>
        </div>
      ) : (
        <div className = "bg-ucwhere-orange p-5 font-jersey text-white">
          <div className = "text-2xl">Room:{room}</div>
          <a
            href="http://localhost:3000"
            target="_blank"
            data-test="new-tab-button"
          >
            New Tab for Testing
          </a>
          <Messages data-test="messaging-component" username={username} room={room} />
          <Lobby code={room} />
          <Game/>
        </div>
      )}
    </div>
  );
}   
