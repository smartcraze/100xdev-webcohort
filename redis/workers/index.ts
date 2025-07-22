import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

const result = await client.xRead(
  {
    key: "betteruptime:websites",
    id: "0",
  },
  {
    COUNT: 10,
    BLOCK: 1000,
  }
);

if (result === null) {
  console.log("No new messages.");
} else {
  for (const stream of result as any) {
    console.log("Stream:", stream.name);
    for (const message of stream.messages) {
      console.log("ID:", message.id);
      console.log("Data:", message.message);
    }
  }
}

await client.quit(); // graceful shutdown
