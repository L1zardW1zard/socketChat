import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";

function Chat({ users, messages, userName, roomId, onAddMessage }) {
  const [messageValue, setMessageValue] = useState("");
  const messagesRef = useRef(null);

  const onSendMessage = () => {
    if (messageValue !== "") {
      socket.emit("room:new_message", { userName, roomId, text: messageValue });
      onAddMessage({ userName, text: messageValue });
      setMessageValue("");
    }
  };

  useEffect(async () => {
    try {
      if (messages != null) {
        // const isMe = () => {
        //   if (userName === messages[messages.length - 1].userName) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // };

        // messagesRef.current.lastChild.classList.add("my-msg-" + isMe()); //Сделать до рендера??
        await messagesRef.current.lastChild.scrollIntoView();
      }
    } catch (error) {}
  }, [messages, userName]);

  return (
    <div className="chat">
      <div className="chat-users">
        <h3>
          Room: <b>{roomId}</b>
        </h3>
        <b>Online ( {users.length} )</b>
        <ul>
          {users.map((name, index) => (
            <li key={name + index}>
              {name}
              {name === userName && " (You)"}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-messages-wrapper">
        <div className="chat-messages">
          <div className="messages" ref={messagesRef}>
            {messages.map((message, index) => {
              // const isMe = () => {
              //   if (userName === message.userName) {
              //     return true;
              //   } else {
              //     return false;
              //   }
              // };
              return (
                <div
                  key={"message" + index}
                  className={"message my-msg-" + message.isMe}
                >
                  <p>{message.text}</p>
                  <div>
                    <span>{message.userName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <form action="">
          <textarea
            value={messageValue}
            onChange={(e) => {
              setMessageValue(e.target.value);
            }}
            rows="3"
            className="form-control"
          ></textarea>
          <button type="button" className="btn" onClick={onSendMessage}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
