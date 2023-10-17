"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./styles.css";

const socket = io("http://localhost:3001");

export default function Page() {
	const [text, setText] = useState("");
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		socket.emit("CLIENT_READY");

		socket.on("GET_MESSAGES", (existingMessages) => {
			setMessages(existingMessages);
		});

		socket.on("SEND_MESSAGE", (newMessage) => {
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		});

		return () => {
			socket.off("GET_MESSAGES");
			socket.off("SEND_MESSAGE");
		};
	}, []);

	function sendMessage() {
		if (!text) return;
		socket.emit("SEND_MESSAGE", text);
		setText("");
	}

	function clearMessages() {
		if (messages.length == 0) return;
		socket.emit("CLEAR");
	}

	function handleKeyDown(e) {
		if (e.keyCode === 13 && !e.shiftKey) {
			// 13 is keyCode for Enter
			e.preventDefault(); // Prevents the default action (new line)
			sendMessage();
		}
	}

	return (
		<>
			<div className="grid w-screen h-screen place-items-center">
				<div className="w-[25rem] h-[45rem] bg-zinc-700 rounded-lg flex flex-col">
					<div className="flex flex-col gap-4 p-4 overflow-x-hidden overflow-y-auto custom-scrollbar scroll-m-4">
						{messages.map((message, index) => (
							<p
								className="w-auto p-2 text-sm text-left rounded-md min-h-fit bg-zinc-800"
								key={index}>
								{message}
							</p>
						))}
					</div>
					<div className="flex self-end w-full gap-2 p-4 mt-auto">
						<input
							type="text"
							onChange={(e) => setText(e.target.value)}
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
