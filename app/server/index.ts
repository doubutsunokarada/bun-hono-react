import app from "./app";

const { fetch } = app;

Bun.serve({
  fetch,
});

console.log("server running");
