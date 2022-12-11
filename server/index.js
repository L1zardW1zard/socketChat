const exp = require("constants");
const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.json());

const rooms = new Map();

app.get("/rooms/:id", (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get("users").values()],
        messages: [...rooms.get(roomId).get("messages").values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
});

app.post("/rooms", (req, res) => {
  const { roomId, userName } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ["users", new Map()],
        ["messages", []],
      ])
    );
  }
  res.send();
});

io.on("connection", (socket) => {
  socket.on("room:join", ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get("users").set(socket.id, userName); //chage to MongoDB
    const users = [...rooms.get(roomId).get("users").values()]; //chage to MongoDB
    io.in(roomId).emit("room:set_users", users);
  });

  socket.on("room:new_message", ({ roomId, userName, text, isMe }) => {
    //isMe = [...rooms.get(roomId).get("users").values()].includes(userName);
    const mesaggeObj = {
      userName,
      text,
      //isMe,
    };
    rooms.get(roomId).get("messages").push(mesaggeObj);
    socket.in(roomId).emit("room:new_message", mesaggeObj);
  });

  socket.on("disconnect", () => {
    rooms.forEach((value, roomId) => {
      if (value.get("users").delete(socket.id)) {
        const users = [...value.get("users").values()]; //chage to MongoDB
        socket.to(roomId).emit("room:set_users", users);
      }
    });
  });
});

server.listen(8000, (err) => {
  if (err) throw Error(err);
  console.log("server is running on port 8000");
});
