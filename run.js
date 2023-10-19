// run.js
const { spawn } = require("child_process");

const server = spawn("npm", ["run", "start:server"], { stdio: "inherit" });
const client = spawn("npm", ["run", "start:client"], { stdio: "inherit" });

server.on("close", (code) => console.log(`Server exited with code ${code}`));
client.on("close", (code) => console.log(`Client exited with code ${code}`));
