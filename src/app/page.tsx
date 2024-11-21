"use client";

import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import Messages from "./messages/page";
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

  return (
    <div className="Home">
      {!showChat ? (
        <div>
          <input
            type="text"
            placeholder="Username"
            onChange={onUsernameChange}
          />
          <br />
          <button onClick={createLobby}>Create a Lobby</button>
          <br />
          <input
            type="text"
            placeholder="Enter Lobby ID"
            onChange={onRoomChange}
          />
          <br />
          <button onClick={joinLobby}>Join a Lobby</button>
        </div>
      ) : (
        <div>
          <h2>Room:{room}</h2>
          <Messages username={username} room={room} />
          <Lobby code={room} />
        </div>
      )}
    </div>
  );
}
