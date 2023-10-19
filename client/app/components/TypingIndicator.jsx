import { useState, useEffect } from "react";
import "./styles/typing.css";

export default function TypingIndicator() {
	const [dot, setDot] = useState(null);

	useEffect(() => {
		const timer = setInterval(() => {
			setDot();
		}, 500);

		return () => clearInterval(timer);
	}, []);

	return (
		<div className="flex items-center gap-2">
			<div
				className="w-2 h-2 bg-gray-400 rounded-full animate-ping-infinite"
				style={{ animationDelay: "0" }}></div>
			<div
				className="w-2 h-2 bg-gray-400 rounded-full animate-ping-infinite"
				style={{ animationDelay: "175ms" }}></div>
			<div
				className="w-2 h-2 bg-gray-400 rounded-full animate-ping-infinite"
				style={{ animationDelay: "350ms" }}></div>
		</div>
	);
}
