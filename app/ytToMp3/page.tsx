"use client";

import { useState, useEffect, ReactNode } from "react";

//first set up page

export default function Page() {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filesToRender, setFilesToRender] = useState<ReactNode>(<h1 className="font-sans text-xl">Loading...</h1>);
	//fetch the files from the server on page load

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
								<a
									href={`/api/convertToMp3/downloadMP3?file=${file}`}
									className="text-blue-500 hover:underline"
								>
									{file}
								</a>
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

	//onload fetch the files
	useEffect(() => {
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
			<br />
			<label className="input input-bordered flex items-center gap-2">
				<input
					type="text"
					className="grow"
					placeholder="Search"
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					className="w-4 h-4 opacity-70"
				>
					<path
						fillRule="evenodd"
						d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
						clipRule="evenodd"
					/>
				</svg>
			</label>
			<br />
			<div className="flex flex-col">{filesToRender}</div>
		</div>
	);

	async function Download() {
		let urlBox = document.getElementById("ytUrl") as HTMLInputElement;
		let downloadButton = document.getElementById("downloadButton") as HTMLButtonElement;

		//disable the input and button while the request is being processed
		urlBox.disabled = true;
		downloadButton.disabled = true;

		//display a message to the user
		alert("Your request is being processed. Please wait...");

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
		fetchFiles();
	}
}

//this function is used to test the API and other features
async function GetFiles(){
	let response = await fetch("/api/convertToMp3/getFiles", {
		method: "GET",
	});

	let files = (await response.json()).files;
	console.log(files);

	return files;
}

async function searchFiles(search: string) {
	let response = await fetch(`/api/convertToMp3/searchFiles?search=${search}`, {
		method: "GET",
	});

	let files = (await response.json()).files;
	//console.log(files);

	return files;
}
