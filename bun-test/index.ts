
console.log("✅ Starting Bun server...");

Bun.serve({
  port: 3000,

  routes: {
    "/hello": (req) => {
      console.log("➡️  GET /hello");
      return new Response("Hello, world!");
    },

    "/square/:num": (req) => {
      const num = Number(req.params.num);
      console.log(`➡️  GET /square/${req.params.num}`);

      if (isNaN(num)) {
        console.log("⚠️  Invalid number received");
        return Response.json({ error: "Invalid number" }, { status: 400 });
      }

      console.log(`✅ Returning square: ${num * num}`);
      return Response.json({ result: num * num });
    },
  },

  fetch(req) {
    const url = new URL(req.url);
    console.log(`❌ Unmatched route: ${req.method} ${url.pathname}`);
    return new Response("Not Found", { status: 404 });
  },
});

console.log("🚀 Server is running on http://localhost:3000");
