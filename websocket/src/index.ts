import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// event handler

wss.on("connection", (socket) => {
  console.log("User connected");

  socket.on("message", (e) => {
    if (e.toString() === "ping") {
      socket.send("pong");
    } else {
      socket.send(e.toString());
    }
  });
});
