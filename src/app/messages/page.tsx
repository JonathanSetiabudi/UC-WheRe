"use client";
import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";

const Messages = () => {

  const [message, setMessage] = useState("");
  const [messageLog, setMessageLog] = useState([]);

  useEffect(() => {
    socket.connect();
    socket.emit("join", 123);

    return () => {
      socket.emit("leave", 123);
      socket.disconnect();
    };
  }, []);

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
    // @ts-expect-error - TS complains about the type of message, but we know it's a string
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
            <form key={index}>
              {`${socket.id?.substring(0, 5)}`}:{message}
              <p>Yes
                <input type="radio" name={`yes_no${index}`} />
              </p>
              <p>
                No
                <input type="radio" name={`yes_no${index}`} />
              </p>
            </form>
          );
        })}
      </ul>
    </div>
  );
};

export default Messages;
