import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState(["Hi there", "suraj"]);
  const wsref = useRef();
  const inputRef = useRef();
  const chatContainerRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [message]);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");
    ws.onmessage = (e) => {
      setMessage((m) => [...m, e.data]);
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };

    wsref.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  function SendMessage() {
    wsref.current.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: (inputRef.current.value.trim() as string) || "Hello",
        },
      })
    );
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      SendMessage();
      inputRef.current.value = "";
    }
  };

  return (
    <div className="bg-black p-5 text-white h-screen flex flex-col">
      <h1 className="text-center text-lg text-red-500 mb-4">Chat App</h1>

      {/* Chat messages container */}
      <div
        className="flex-grow overflow-y-auto mb-4 space-y-2 scrollbar-hide"
        ref={chatContainerRef}
      >
        {message.map((m, i) => (
          <div key={i} className="m-2 p-1">
            <span className="bg-slate-800 rounded p-2 m-1">{m}</span>
          </div>
        ))}
      </div>

      {/* Input and button container */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Type a message..."
          ref={inputRef}
          onKeyDown={handleKeyDown}
          className="bg-slate-900 rounded-md p-2 w-full border border-red-300 focus:outline-none"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={SendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
