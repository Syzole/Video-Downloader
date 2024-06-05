"use client";

//first set up page
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
					onClickCapture={(e) => e.preventDefault()}
					onClick={(e) => window.open(e.currentTarget.href, "_blank")}
				>
					{" "}
					Youtube
				</a>{" "}
				or a{" "}
				<a
					href="https://music.youtube.com/"
					className="text-blue-600"
					onClickCapture={(e) => e.preventDefault()}
					onClick={(e) => window.open(e.currentTarget.href, "_blank")}
				>
					{" "}
					Youtube Music{" "}
				</a>
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
				id="downloadButton"
			>
				{" "}
				Download
			</button>
		</div>
	);
}

//this function is used to test the API and other features
async function Test() {
	let test = await fetch("/api/convertToMp3/test", {
		method: "GET",
	});
	let json = await test.json();
	console.log(json);
}

//this function is called when the download button is clicked sending the URL to the server for processing
async function Download() {
	let urlBox = document.getElementById("ytUrl") as HTMLInputElement;
	let downloadButton = document.getElementById("downloadButton") as HTMLButtonElement;

	//disable the input and button while the request is being processed
	urlBox.disabled = true;
	downloadButton.disabled = true;

	let url = urlBox.value;
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

	let json = await response.json();
	console.log(json);
	if (json.error) {
		alert(json.error);
	} else {
		alert(json.message);
	}

	urlBox.disabled = false;
	downloadButton.disabled = false;
}
