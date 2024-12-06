"use client";
import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";

interface MessageData {
  room: string;
  author: string;
  message: string;
  received: boolean;
  time: string;
}

const Messages = ({
  username,
  room,
  isHost,
}: {
  username: string;
  room: string;
  isHost: boolean;
}) => {
  const [message, setMessage] = useState("");
  const [messageLog, setMessageLog] = useState<MessageData[]>([]);
  const [canMessage, setCanMessage] = useState<boolean>(isHost);

  useEffect(() => {
    socket.off("receivedMessage").on("receivedMessage", (data) => {
      data.received = true;
      console.log(data);
      setMessageLog((list) => [...list, data]);
    });

    socket
      .off("receivedAnswer")
      .on("receivedAnswer", (answer: string, author: string) => {
        const answerData = {
          room: room,
          author: author,
          message: answer,
          received: false,
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        };
        setMessageLog((list) => [...list, answerData]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setCanMessage((previous) => !previous);
      const messageData = {
        room: room,
        author: username,
        message: message,
        received: false,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      //Adds message to messageLog
      setMessageLog((list) => [...list, messageData]);
      await socket.emit("sendMessage", messageData);
      //Clears input field
      setMessage("");
    }
  };

  function answerQuestion(answer: string, room: string, author: string) {
    setCanMessage((previous) => !previous);
    socket.emit("answerQuestion", answer, room, author);
  }

  const leave = () => {
    socket.emit("leave", room);
  };

  return (
    <div>
      <div className="mb-2 text-3xl text-gray-800" data-test="message-log-header">
        Message Log
      </div>
      <div className="rounded-lg">
        <ul>
          {messageLog.map((messageData, index) => {
            return (
              <form className="text-gray-800" key={index}>
                {`${messageData.author}: ${messageData.message}`}
                <br />
                {messageData.received ? (
                  <div>
                    <button className="bg-ucwhere-green px-1 text-white rounded-sm m-2 enabled:hover:bg-emerald-400"
                      type="button"
                      name={`yes_no${index}`}
                      onClick={() =>
                        answerQuestion("Yes", messageData.room, username)
                      }
                    >
                      Yes
                    </button>
                    <button className="bg-ucwhere-red px-1 text-white rounded-sm enabled:hover:bg-rose-500"
                      type="button"
                      name={`yes_no${index}`}
                      onClick={() =>
                        answerQuestion("No", messageData.room, username)
                      }
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <> </>
                )}
              </form>
            );
          })}
        </ul>
      </div>
      <div className="chat-footer">
        <form>
          <button className="text-ucwhere-light-blue"
            onClick={sendMessage}
            data-test="send-message-button"
            disabled={!canMessage}
          >
            &#9658;
          </button>
          <input
            className="text-black p-1 pl-3 rounded-md mb-5"
            onChange={onChange}
            value={message}
            type="text"
            placeholder="Your message"
            data-test="message-input"
          ></input>
          <br />

          <button
            className="text-xl bg-ucwhere-red p-2 mb-2 rounded-md text-white enabled:hover:bg-rose-500 "
            data-test="leave-button"
            onClick={leave}
          >
            Leave
          </button>
        </form>
      </div>
    </div>
  );
};

export default Messages;
