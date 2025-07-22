import { test, expect } from "bun:test";

const BASE = "http://localhost:3000";

test("GET /hello should return 'Hello, world!'", async () => {
  const res = await fetch(`${BASE}/hello`);
  const text = await res.text();

  expect(res.status).toBe(200);
  expect(text).toBe("Hello, world!");
});

test("GET /square/5 should return 25", async () => {
  const res = await fetch(`${BASE}/square/5`);
  const json = await res.json();

  expect(res.status).toBe(200);
  expect(json.result).toBe(20);
});

test("GET /square/abc should return 400 and error message", async () => {
  const res = await fetch(`${BASE}/square/abc`);
  const json = await res.json();

  expect(res.status).toBe(400);
  expect(json.error).toBe("Invalid number");
});

test("GET /unknown should return 404", async () => {
  const res = await fetch(`${BASE}/something/else`);
  const text = await res.text();

  expect(res.status).toBe(404);
  expect(text).toBe("Not Found");
});
