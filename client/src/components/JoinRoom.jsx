import React, { useState } from "react";
import socket from "../socket";
import axios from "axios";

function JoinRoom({ onLogin }) {
  const [roomId, setRoomId] = useState("");
  const [userName, setUsername] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onJoin = async () => {
    if (!roomId || !userName) {
      return alert("Not valid data");
    }
    const obj = {
      roomId,
      userName,
    };
    setLoading(true);
    await axios.post("/rooms", obj);
    onLogin(obj);
  };

  return (
    <div className="wrapper">
      <br />
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => {
          setRoomId(e.target.value);
        }}
      />
      <br />
      <input
        type="text"
        placeholder="Nickname"
        value={userName}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <br />
      <button disabled={isLoading} onClick={onJoin} className="btn">
        {isLoading ? "Loading..." : "Join"}
      </button>
    </div>
  );
}
export default JoinRoom;
