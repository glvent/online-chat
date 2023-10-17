const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

let messages = [];

io.on("connection", (socket) => {
	console.log("Connected to client!");

	socket.on("CLIENT_READY", () => {
		socket.emit("GET_MESSAGES", messages);
	});

	socket.on("SEND_MESSAGE", (message) => {
		messages.push(message); // ADD NEW MESSAGE TO ARRAY
		io.emit("SEND_MESSAGE", message); // BROADCAST THE NEW MESSAGE TO ALL CLIENTS
	});

	socket.on("CLEAR", () => {
		messages = [];
		io.emit("GET_MESSAGES", messages);
	});
});

server.listen(3001, () => {
	console.log("✔ Server listening on port 3001");
});
