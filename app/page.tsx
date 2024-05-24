import Link from "next/link";
import React from "react";

export default function App() {
	return (
		<div
			data-theme="dark"
			className="min-h-screen flex flex-col"
		>
			<header className="flex justify-center bg-blue-500 p-4">
				<h1 className="text-center text-4xl">Youtube Downloader</h1>
			</header>
			<main className="p-4">
				<h2 className="text-center">This is the home page, pick what service you would like to use, it will redirect you to the page to begin using them</h2>
				<div className="flex flex-col p-9">
					<Link
						href="/ytToMp3"
						className="btn btn-primary mb-4"
					>
						YT-&gt;MP3
					</Link>
					<Link
						href="/ytToMp4"
						className="btn btn-primary mb-4"
					>
						YT-&gt;MP4
					</Link>
					<Link
						href="/spotify"
						className="btn btn-primary"
					>
						Spotify
					</Link>
				</div>
				
			</main>
		</div>
	);
}
