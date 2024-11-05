"use client";
import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";

const Messages = () => {
  useEffect(() => {
    socket.connect();
    socket.emit("join", 123);

    return () => {
      socket.emit("leave", 123);
      socket.disconnect();
    };
  }, []);

  const [message, setMessage] = useState("hello world");

  const onSend = () => {
    console.log("NICE", message, socket);
    socket.emit("message", {
      message,
    });
  };

  return (
    <>
      <button onClick={onSend}>Send</button>
    </>
  );
};

export default Messages;
