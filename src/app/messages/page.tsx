"use client";
import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";

// @ts-expect-error - TS complains about the type of username & room but we don't need to worry about it
const Messages = ({ username, room }) => {
  const [message, setMessage] = useState("");
  const [messageLog, setMessageLog] = useState([]);

  useEffect(() => {
    socket.off("receivedMessage").on("receivedMessage", (data) => {
      console.log(data);
      // @ts-expect-error - TS complains about the type of message, but we know it's a string
      setMessageLog((list) => [...list, data.author + ":" + data.message]);
    });
  }, []);

  // @ts-expect-error - TS complains about the type of e, but we don't use it
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  // @ts-expect-error - TS complains about the type of e, but we don't use it
  const sendMessage = async (e) => {
    //prevents the page from refreshing
    e.preventDefault();
    //Emits message to server
    if (message.trim() !== "") {
      const messageData = {
        room: room,
        author: username,
        message: message,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      //Adds message to messageLog
      // @ts-expect-error - TS complains about the type of message, but we know it's a string
      setMessageLog((list) => [...list, username + ":" + message]);
      await socket.emit("sendMessage", messageData);
      //Clears input field
      setMessage("");
    }
  };

  const leave = () => {
    socket.emit("leave", room);
  };

  return (
    <div>
      <div className="chat-header"></div>
      <p data-test="message-log-header">Message Log</p>
      <div className="chat-body">
        <ul>
          {messageLog.map((message, index) => {
            return (
              <form key={index}>
                {message}
                <br />
                {}
                <p>
                  Yes
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
      <div className="chat-footer">
        <form>
          <button onClick={sendMessage} data-test="send-message-button">
            &#9658;
          </button>
          <input
            onChange={onChange}
            value={message}
            type="text"
            placeholder="Your message"
            data-test="message-input"
          ></input>
          <br />
          <button onClick={leave} data-test="leave-button">
            Leave
          </button>
        </form>
      </div>
    </div>
  );
};

export default Messages;
