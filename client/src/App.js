import React, { useEffect, useReducer } from "react";
import "./App.css";
import socket from "./socket";
import reducer from "./reducer";
import axios from "axios";

import "./css/font.css";

import JoinRoom from "./components/JoinRoom";
import Chat from "./components/Сhat";

function App() {
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  });

  const onLogin = async (obj) => {
    dispatch({
      type: "JOINED",
      payload: obj,
    });
    socket.emit("room:join", obj);
    const { data } = await axios.get(`/rooms/${obj.roomId}`);
    dispatch({ type: "SET_DATA", payload: data });
  };

  const setUsers = (users) => {
    dispatch({ type: "SET_USERS", payload: users });
  };

  const addMessage = (message) => {
    message.isMe = state.joined;

    dispatch({
      type: "NEW_MESSAGE",
      payload: message,
    });
  };

  useEffect(() => {
    socket.on("room:set_users", setUsers);
    socket.on("room:new_message", addMessage);
  }, []);

  //console.log("state.joined: ", state.joined);

  return (
    <div className="container">
      {!state.joined ? (
        <JoinRoom onLogin={onLogin} />
      ) : (
        <Chat {...state} onAddMessage={addMessage} />
      )}
    </div>
  );
}

export default App;
