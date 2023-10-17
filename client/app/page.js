import Link from "next/link";

export default function Home() {
	return (
		<main className="grid h-screen place-content-center">
			<Link
				className="flex items-center justify-center w-40 h-10 transition-all delay-100 rounded bg-zinc-700 ring ring-offset-2 hover:ring-offset-4 ring-offset-zinc-800 ring-violet-600 "
				href={"/main_room"}>
				JOIN ROOM
			</Link>
		</main>
	);
}
