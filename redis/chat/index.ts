import { publisher, subscriber } from "./redis";




const rooms = new Map<string, Set<WebSocket>>();


Bun.serve({
    fetch(req, server) {
        if (server.upgrade(req)) {
            return;
        }
        return new Response("Upgrade failed", { status: 500 });
    },

    websocket: {
        open(ws) {
            console.log("WebSocket opened");
            ws.subscribe("default"); // fallback room
        },
        close(ws, code, reason) {
            console.log(`WebSocket closed: ${code} - ${reason}`);
            for (const [room, clients] of rooms.entries()) {
                clients.delete(ws as unknown as WebSocket);
                if (clients.size === 0) {
                    rooms.delete(room);
                }
            }
        },
        async message(ws, message) {
            let msg;
            try {
                msg = JSON.parse(message.toString());
            } catch {
                ws.send(" Invalid JSON");
                return;
            }

            const { type, room, text, user } = msg;

            if (type === "join" && room) {
                ws.subscribe(room);
                if (!rooms.has(room)) rooms.set(room, new Set());
                rooms.get(room)?.add(ws as unknown as WebSocket);
                console.log(`👤 User joined room: ${room}`);

                const lastMessages = await publisher.xRange(`chat:${room}:history`, "-", "+", { COUNT: 20 }) as { id: string, message: Record<string, string> }[];

                const historyMessages = lastMessages.map(({ message: fields }) => ({
                    user: fields.user,
                    text: fields.text,
                    room,
                    timestamp: parseInt(fields.timestamp ?? "0"),
                    isHistory: true,
                }));

                ws.send(JSON.stringify({ type: "history", messages: historyMessages }));
                console.log(`📜 Sent last messages to user in room: ${room}`);

            }

            if (type === "message" && room && text) {
                const payload = JSON.stringify({ user, text, room, timestamp: new Date().toISOString() });
                await publisher.xAdd("chat:messages", "*", {
                    user,
                    text,
                    room,
                    timestamp: new Date().toISOString()
                });
                await publisher.publish(`chat:${room}`, payload);
            }
        }
    },

},
);


await subscriber.pSubscribe("chat:*", (message, channel) => {
    const room = channel.replace("chat:", "");
    const payload = message.toString();

    const clients = rooms.get(room);
    if (clients) {
        for (const ws of clients) {
            ws.send(payload);
        }
    }
});