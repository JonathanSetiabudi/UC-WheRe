"use client";
import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import Messages from "./messages/page";

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
    setRoom(e.target.value);
  };

  const joinLobby = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_lobby", room);
      setShowChat(true);
    }
  };

  useEffect(() => {
    socket.connect();

    return () => {
      socket.emit("leave", 123);

      socket.disconnect();
    };
  }, []);

  return (
    <div className="Home">
      {!showChat ? (
        <div>
          <h3>Join a Lobby</h3>
          <input
            type="text"
            placeholder="Username"
            onChange={onUsernameChange}
          />
          <input
            type="text"
            placeholder="Enter Lobby ID"
            onChange={onRoomChange}
          />
          <button onClick={joinLobby}>Join</button>
        </div>
      ) : (
        <Messages username={username} room={room} />
      )}
    </div>
  );
}
