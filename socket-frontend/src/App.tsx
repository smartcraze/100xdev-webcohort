import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const inputref = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<string[]>([]);

  function sendMessage() {
    const message = inputref.current?.value;
    if (!message) {
      return;
    }
    if (socket) {
      socket.send(message);
    }
  }
  useEffect(function () {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);
    ws.onmessage = function (e) {
      setMessages([...messages, e.data]);
    };
  }, []);

  return (
    <div>
      <input ref={inputref} type="text" placeholder="message..." />
      <button onClick={sendMessage}>send</button>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
