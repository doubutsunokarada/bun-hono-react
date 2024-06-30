import app from "./app";

const { fetch } = app;

Bun.serve({
  port: process.env.PORT || 3000,
  hostname: "0.0.0.0",
  fetch,
});

console.log("server running");
