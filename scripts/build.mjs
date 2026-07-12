import { cpSync, mkdirSync, rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/server", { recursive: true });
mkdirSync("dist/client/assets", { recursive: true });
mkdirSync("dist/.openai", { recursive: true });

cpSync("server/worker.js", "dist/server/index.js");
cpSync("index.html", "dist/client/index.html");
cpSync("app.js", "dist/client/app.js");
cpSync("styles.css", "dist/client/styles.css");
cpSync("assets", "dist/client/assets", { recursive: true });
cpSync(".openai/hosting.json", "dist/.openai/hosting.json");
