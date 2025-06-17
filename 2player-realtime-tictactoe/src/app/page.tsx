"use client";

import { useEffect, useState, useRef } from "react";

type Symbol = "X" | "O" | "";
type ServerMessage =
  | { type: "start"; gameId: string; symbol: Symbol }
  | { type: "move"; board: Symbol[][]; nextPlayer: number }
  | { type: "end"; winner: Symbol | "tie" | "opponent_left"; board?: Symbol[][] };

export default function TicTacToe() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [board, setBoard] = useState<Symbol[][]>(Array(3).fill(null).map(() => Array(3).fill("")));
  const [symbol, setSymbol] = useState<Symbol>("");
  const [myIndex, setMyIndex] = useState<number>(-1);
  const [gameId, setGameId] = useState<string | null>(null);
  const [turn, setTurn] = useState<number>(0);
  const [status, setStatus] = useState<string>("Waiting for opponent...");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");
    socketRef.current = ws;
    setSocket(ws);

    ws.onmessage = (event) => {
      const data: ServerMessage = JSON.parse(event.data);

      if (data.type === "start") {
        setGameId(data.gameId);
        setSymbol(data.symbol);
        setMyIndex(data.symbol === "X" ? 0 : 1);
        setStatus(data.symbol === "X" ? "Your turn!" : "Opponent's turn.");
      }

      if (data.type === "move") {
        setBoard(data.board);
        setTurn(data.nextPlayer);
        setStatus(data.nextPlayer === myIndex ? "Your turn!" : "Opponent's turn.");
      }

      if (data.type === "end") {
        if (data.board) setBoard(data.board);
        if (data.winner === "tie") setStatus("It's a tie!");
        else if (data.winner === "opponent_left") setStatus("Opponent left. You win!");
        else setStatus(data.winner === symbol ? "You win!" : "You lose!");
      }
    };

    return () => ws.close();
  }, []);

  const handleClick = (row: number, col: number) => {
    if (!gameId || !socketRef.current || board[row][col] || turn !== myIndex) return;

    const msg = {
      gameId,
      row,
      col,
      symbol,
    };
    socketRef.current.send(JSON.stringify(msg));
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-black text-white gap-4">
      <h1 className="text-3xl font-bold">Tic Tac Toe</h1>
      <p>{status}</p>
      <div className="grid grid-cols-3 gap-2">
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <button
              key={`${rIdx}-${cIdx}`}
              onClick={() => handleClick(rIdx, cIdx)}
              className="w-20 h-20 text-3xl font-bold border-2 border-white flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              {cell}
            </button>
          ))
        )}
      </div>
      {gameId && <p className="text-sm text-gray-400">Game ID: {gameId}</p>}
      <button onClick={() => location.reload()} className="mt-4 px-4 py-2 bg-white text-black rounded">
        Play Again
      </button>
    </main>
  );
}
