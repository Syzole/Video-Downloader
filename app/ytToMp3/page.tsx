"use client";

import { useState, useEffect, ReactNode } from "react";

//first set up page
export default function Page() {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filesToRender, setFilesToRender] = useState<ReactNode>(<h1 className="font-sans text-xl">Loading...</h1>);

	//fetch the files from the server on page load
	useEffect(() => {
		async function fetchFiles() {
			try {
				let files = await GetFiles();
				setFiles(files);
				if (files.length === 0) {
					setFilesToRender(<h1 className="font-sans text-xl">No files have been converted to MP3</h1>);
				} else {
					setFilesToRender(
						<ul className="list-disc list-inside">
							{files.map((file: string, index: number) => (
								<li
									key={index}
									className="font-sans text-xl"
								>
									{file}
								</li>
							))}
						</ul>
					);
				}
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false); // Set loading to false when fetch completes
			}
		}
		fetchFiles();
	}, []);

	return (
		<div className="flex flex-col justify-center p-8">
			<div className="navbar bg-base-100">
				<a
					className="btn btn-info text-xl"
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
			<br />
			<h1 className="font-sans font-bold underline justify-start text-xl"> Files that have been converted to MP3</h1>
			<div className="flex flex-col">{filesToRender}</div>
		</div>
	);
}

//this function is used to test the API and other features
async function GetFiles() {
	let response = await fetch("/api/convertToMp3/getFiles", {
		method: "GET",
	});

	let files = (await response.json()).files;
	//console.log(files);

	return files;
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
