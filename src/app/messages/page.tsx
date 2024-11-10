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

  const [message, setMessage] = useState("");
  const [messageLog, setMessageLog] = useState(["Welcome to the game!"]);
  // @ts-expect-error - TS complains about the type of e, but we don't use it
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  // @ts-expect-error - TS complains about the type of e, but we don't use it
  const onSend = (e) => {
    //prevents the page from refreshing
    e.preventDefault();
    //Logs to server
    console.log("NICE", message, socket);
    //Emits message to server
    socket.emit("message", message);
    //Adds message to messageLog
    setMessageLog([...messageLog, message]);
    //Clears input field
    setMessage("");
  };

  return (
    <div>
      <form>
        <input
          onChange={onChange}
          value={message}
          type="text"
          placeholder="Your message"
        ></input>
        <button onClick={onSend}>Send</button>
      </form>
      <ul>
        {messageLog.map((message, index) => {
          return (
            <li key={index}>
              {`${socket.id?.substring(0, 5)}`}:{message}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Messages;
