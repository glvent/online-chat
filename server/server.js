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

console.log(messages);

io.on("connection", (socket) => {
	console.log("Connected to client!");

	socket.on("CLIENT_READY", () => {
		socket.emit("GET_MESSAGES", messages);
	});

	socket.on("SEND_MESSAGE", (message) => {
		const newMessage = { text: message.text, owner: message.owner };
		messages.push(newMessage); // ADD NEW MESSAGE TO ARRAY
		io.emit("SEND_MESSAGE", newMessage); // BROADCAST THE NEW MESSAGE TO ALL CLIENTS
	});

	socket.on("CLEAR", () => {
		messages = [];
		io.emit("GET_MESSAGES", messages);
	});
});

server.listen(3001, () => {
	console.log("✔ Server listening on port 3001");
});
