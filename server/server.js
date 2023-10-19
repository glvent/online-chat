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
let peopleTyping = [];

io.on("connection", (socket) => {
	console.log("Connected to client!");

	socket.on("CLIENT_READY", () => {
		const isSomeoneTyping = peopleTyping.length > 0;
		socket.emit("GET_MESSAGES", messages);
		socket.emit("GET_TYPING", isSomeoneTyping);
	});

	socket.on("SEND_MESSAGE_TO_SERVER", (message) => {
		const newMessage = { text: message.text, owner: message.owner };
		messages.push(newMessage); // ADD NEW MESSAGE TO ARRAY
		io.emit("SEND_MESSAGE_TO_CLIENT", newMessage); // BROADCAST THE NEW MESSAGE TO ALL CLIENTS
	});

	socket.on("CLEAR", () => {
		messages = [];
		peopleTyping = [];

		io.emit("GET_MESSAGES", messages);
		io.emit("GET_TYPING", false);
	});

	socket.on("TYPING", (isTyping, uid) => {
		if (isTyping) {
			if (!peopleTyping.includes(uid)) {
				peopleTyping.push(uid);
			}
		} else {
			const index = peopleTyping.indexOf(uid);
			if (index !== -1) {
				peopleTyping.splice(index, 1);
			}
		}

		const isSomeoneTyping = peopleTyping.length > 0;
		socket.broadcast.emit("GET_TYPING", isSomeoneTyping);
	});
});

server.listen(3001, "0.0.0.0", () => {
	console.log("✔ Server listening on port 3001");
});
