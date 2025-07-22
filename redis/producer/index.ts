import { createClient } from "redis";

const client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();


await client.xAdd("betteruptime:websites", "*", {
    "url": "https://www.facebook.com",
    "id": "1"
});

client.destroy();