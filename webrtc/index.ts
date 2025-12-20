import { WebSocketServer, WebSocket } from "ws";

const JOIN = "join";
const OFFER = "offer";
const ANSWER = "answer";
const ICE = "ice";

const wss = new WebSocketServer({ port: 8080 });

const rooms = new Map<string, Set<WebSocket>>();

function log(...args: any[]) {
  console.log(new Date().toISOString(), ...args);
}

function forwardToRoom(sender: WebSocket, roomId: string, message: any) {
  const clients = rooms.get(roomId);
  if (!clients) return;

  for (const client of clients) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
}

wss.on("connection", (ws) => {
  log("🔌 client connected");

  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    log("📩 received:", msg.type);

    switch (msg.type) {
      case JOIN: {
        const { roomId } = msg;

        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set());
          log("🆕 room created:", roomId);
        }

        const clients = rooms.get(roomId)!;
        clients.add(ws);

        log("👥 joined room", roomId, "count:", clients.size);

        if (clients.size === 1) {
          ws.send(JSON.stringify({ type: "role", role: "caller" }));
          log("🎯 role = caller");
        } else {
          ws.send(JSON.stringify({ type: "role", role: "callee" }));
          log("🎯 role = callee");

          // 🔥 notify caller that peer is ready
          for (const client of clients) {
            if (client !== ws) {
              client.send(JSON.stringify({ type: "peer-ready" }));
              log("🚀 peer-ready sent to caller");
            }
          }
        }
        break;
      }

      case OFFER:
        log("📨 OFFER");
        forwardToRoom(ws, msg.roomId, {
          type: OFFER,
          sdp: msg.sdp,
        });
        break;

      case ANSWER:
        log("📨 ANSWER");
        forwardToRoom(ws, msg.roomId, {
          type: ANSWER,
          sdp: msg.sdp,
        });
        break;

      case ICE:
        log("🧊 ICE");
        forwardToRoom(ws, msg.roomId, {
          type: ICE,
          candidate: msg.candidate,
        });
        break;
    }
  });

  ws.on("close", () => {
    log("❌ client disconnected");
    for (const [roomId, clients] of rooms) {
      if (clients.delete(ws) && clients.size === 0) {
        rooms.delete(roomId);
        log("🗑️ room deleted:", roomId);
      }
    }
  });
});

log("🚀 WebSocket running on ws://localhost:8080");
