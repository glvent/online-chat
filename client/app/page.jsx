"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
	const [name, setName] = useState("");
	const [isInputOpen, setIsInputOpen] = useState(false);
	const inputRef = useRef(null);
	const buttonRef = useRef(null);

	const router = useRouter();

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (
				isInputOpen &&
				!inputRef?.current.contains(e.target) &&
				!buttonRef?.current.contains(e.target)
			) {
				setIsInputOpen(false);
			}
		};

		window.addEventListener("click", handleClickOutside);

		return () => {
			window.removeEventListener("click", handleClickOutside);
		};
	}, [isInputOpen]);

	return (
		<main className="grid h-screen place-content-center">
			{!isInputOpen ? (
				<button
					className="flex items-center justify-center w-40 h-10 transition-all delay-100 rounded bg-zinc-700 ring ring-offset-2 hover:ring-offset-4 ring-offset-zinc-800 ring-violet-600 "
					onClick={(e) => {
						e.stopPropagation();
						setIsInputOpen(true);
					}}>
					JOIN ROOM
				</button>
			) : (
				<div className="relative flex transition-all delay-100 rounded group hover:ring-offset-4 ring ring-offset-2 ring-offset-zinc-800 ring-violet-600">
					<input
						onChange={(e) => {
							e.stopPropagation();
							setName(e.target.value);
							sessionStorage.setItem("name", e.target.value);
						}}
						placeholder="name"
						ref={inputRef}
						className="h-10 p-2 rounded outline-none w-80 bg-zinc-700"
					/>
					<button
						onClick={(e) => {
							router.push("main_room");
							e.stopPropagation();
						}}
						ref={buttonRef}
						disabled={!name}
						className="absolute grid w-8 h-8 font-bold rounded top-1 right-1 disabled:bg-zinc-600 bg-violet-600 place-items-center">
						&gt;
					</button>
				</div>
			)}
		</main>
	);
}
