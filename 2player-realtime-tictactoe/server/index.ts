// server.ts
type Symbol = "X" | "O";
type GameState = "waiting" | "playing" | "ended";

interface Game {
  id: string;
  players: [WebSocket, WebSocket];
  board: Symbol[][];
  currentPlayer: number;
  state: GameState;
}

interface ServerMessage {
  type: "start" | "move" | "end";
  gameId?: string;
  board?: Symbol[][];
  winner?: Symbol | "tie" | "opponent_left";
  nextPlayer?: number;
  message?: string;
  symbol?: Symbol;
}

const games = new Map<string, Game>();
let waitingPlayer: WebSocket | null = null;

function createBoard(): Symbol[][] {
  return Array.from({ length: 3 }, () => Array(3).fill("") as Symbol[]);
}

function checkWinner(board: Symbol[][]): Symbol | "tie" | null {
  const lines = [
    [board[0][0], board[0][1], board[0][2]],
    [board[1][0], board[1][1], board[1][2]],
    [board[2][0], board[2][1], board[2][2]],
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]],
  ];

  for (const line of lines) {
    if (line[0] && line[0] === line[1] && line[1] === line[2]) {
      return line[0];
    }
  }

  return board.flat().every(cell => cell) ? "tie" : null;
}

const server = Bun.serve({
  port: 3001,
  fetch(req, server) {
    if (server.upgrade(req)) return undefined;
    return new Response("Tic Tac Toe WebSocket Server");
  },
  websocket: {
    open(ws) {
      if (waitingPlayer) {
        const gameId = Math.random().toString(36).substring(2, 8);
        const game: Game = {
          id: gameId,
          players: [waitingPlayer, ws],
          board: createBoard(),
          currentPlayer: 0,
          state: "playing",
        };
        games.set(gameId, game);

        waitingPlayer.subscribe(gameId);
        ws.subscribe(gameId);

        const startMsg1: ServerMessage = {
          type: "start",
          gameId,
          message: "Game started!",
          symbol: "X",
        };
        const startMsg2: ServerMessage = {
          type: "start",
          gameId,
          message: "Game started!",
          symbol: "O",
        };

        game.players[0].send(JSON.stringify(startMsg1));
        game.players[1].send(JSON.stringify(startMsg2));

        waitingPlayer = null;
      } else {
        waitingPlayer = ws;
      }
    },

    message(ws, raw) {
      const data = JSON.parse(raw as string) as {
        gameId: string;
        row: number;
        col: number;
        symbol: Symbol;
      };
      const game = games.get(data.gameId);
      if (!game || game.state !== "playing") return;

      const { board, currentPlayer, players } = game;

      // Validate move
      if (board[data.row][data.col]) return;

      const playerIndex = players.indexOf(ws);
      if (playerIndex !== game.currentPlayer) return;

      board[data.row][data.col] = data.symbol;

      const winner = checkWinner(board);
      if (winner) {
        game.state = "ended";
        const msg: ServerMessage = {
          type: "end",
          winner,
          board,
        };
        server.publish(game.id, JSON.stringify(msg));
      } else {
        game.currentPlayer = 1 - game.currentPlayer;
        const msg: ServerMessage = {
          type: "move",
          board,
          nextPlayer: game.currentPlayer,
        };
        server.publish(game.id, JSON.stringify(msg));
      }
    },

    close(ws) {
      if (waitingPlayer === ws) {
        waitingPlayer = null;
        return;
      }

      for (const [id, game] of games.entries()) {
        if (game.players.includes(ws)) {
          server.publish(id, JSON.stringify({ type: "end", winner: "opponent_left" }));
          games.delete(id);
        }
      }
    },
  },
});

console.log(`🚀 Server running on ws://localhost:${server.port}`);
