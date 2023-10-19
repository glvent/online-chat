"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./styles.css";
import TypingIndicator from "../components/TypingIndicator";
import { v4 as uuidv4 } from "uuid";

let socket;

export default function Page() {
	const [text, setText] = useState("");
	const [messages, setMessages] = useState([]);
	const [typing, setTyping] = useState(false);
	const [uid] = useState(uuidv4);
	const name = sessionStorage.getItem("name");

	useEffect(() => {
		socket = io(`http://${process.env.HOST_IP}:3001`);
		if (!socket) return;
		console.log(socket);
		// HOST_IP allows for support on all local devices.
		socket.on("connect", () => {
			socket.emit("CLIENT_READY");
		});

		socket.on("GET_MESSAGES", (existingMessages) => {
			console.log("got initial messages");
			setMessages(existingMessages);
		});

		socket.on("SEND_MESSAGE_TO_CLIENT", (newMessage) => {
			console.log("got message from server");
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		});

		socket.on("GET_TYPING", (isTyping) => {
			console.log("other client is typing");
			setTyping(isTyping);
		});

		return () => {
			socket.off("GET_MESSAGES");
			socket.off("SEND_MESSAGE_TO_CLIENT");
			socket.off("GET_TYPING");
			socket.disconnect();
		};
	}, []);

	function sendMessage() {
		if (!text) return;
		socket.emit("SEND_MESSAGE_TO_SERVER", { text: text, owner: name });
		socket.emit("TYPING", false, uid);
		setText("");
	}

	function clearMessages() {
		if (messages.length == 0) return;
		socket.emit("CLEAR");
	}

	function handleKeyDown(e) {
		if (e.keyCode === 13 && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	function handleTextChange(e) {
		const text = e.target.value;
		setText(text);
		socket.emit("TYPING", !!text, uid);
	}

	return (
		<>
			<div className="grid w-screen h-screen place-items-center">
				<div className="w-[25rem] h-[45rem] bg-zinc-700 rounded-lg flex flex-col">
					<div className="flex flex-col gap-2 p-4 overflow-x-hidden overflow-y-auto custom-scrollbar">
						{messages.map((message, _) => (
							<>
								<p
									className={`text-xs ${
										name != message?.owner && "self-end"
									}`}>
									{message?.owner}
								</p>
								<p className="w-auto p-2 text-sm text-left rounded-md min-h-fit bg-zinc-800">
									{message?.text}
								</p>
							</>
						))}
						{typing && <TypingIndicator />}
					</div>
					<div className="flex self-end w-full gap-2 p-4 mt-auto">
						<input
							type="text"
							onChange={handleTextChange}
							onKeyDown={handleKeyDown}
							className="w-full h-8 pl-2 rounded-md outline-none bg-zinc-800"
							value={text}
						/>
						<button
							className="min-w-[2rem] min-h-[2rem] font-bold rounded-md bg-violet-600 hover:bg-violet-500"
							onClick={sendMessage}>
							&gt;
						</button>
						<button
							className="min-w-[2rem] min-h-[2rem] font-bold rounded-md bg-zinc-600 hover:bg-zinc-500"
							onClick={clearMessages}>
							&times;
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
