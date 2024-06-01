"use client";

export default function Page() {
	return (
		<div className="flex flex-col justify-center p-8">
			<div className="navbar bg-base-100">
				<a
					className="btn btn-ghost text-xl"
					href="/"
				>
					Home
				</a>
			</div>
			<h1 className="font-sans self-center p-8 text-xl">
				Below in the text box, add a{" "}
				<a
					href="https://www.youtube.com/"
					className="text-blue-600"
				>
					{" "}
					Youtube
				</a>{" "}
				URL and it will be converted to an MP3 file ready to downloaded
			</h1>
			<input
				type="text"
				id="ytUrl"
				placeholder="Youtube URL"
				className="input input-md input-primary mb-5"
			/>
			<button
				className="btn btn-accent justify-center mb-4"
				onClick={Download}
			>
				{" "}
				Download
			</button>
		</div>
	);
}

async function Test() {
	let test = await fetch("/api/convertToMp3/test", {
		method: "GET",
	});
	let json = await test.json();
	console.log(json);
}

async function Download() {
	let url = (document.getElementById("ytUrl") as HTMLInputElement).value;
	console.log(url);
	if (!url) {
		alert("Please enter a URL");
		return;
	}
	
	let response = await fetch("/api/convertToMp3/downloadMP3", {
		method: "POST",
		body: JSON.stringify({ url }),
		headers: {
			"Content-Type": "application/json",
		},
	});
}
