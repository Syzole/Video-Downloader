"use client";

import { useState, useEffect, ReactNode } from "react";

//first set up page

let files: string[] = [];

export default function Page() {
	const [filesToRender, setFilesToRender] = useState<ReactNode>(<h1 className="font-sans text-xl">Loading...</h1>);
	//fetch the files from the server on page load

	async function fetchFiles() {
		try {
			files = await GetFiles();
		} catch (e) {
			console.error(e);
		}
	}

	async function renderFiles(array: string[]) {
		let searchBar = document.getElementById("searchBar") as HTMLInputElement;
		if (array.length === 0) {
			await setFilesToRender(<h1 className="font-sans text-xl">No files have been converted to MP3</h1>);
			searchBar.disabled = true;
		} else {
			await setFilesToRender(
				<ul className="list-disc list-inside">
					{array.map((file: string, index: number) => (
						<li
							key={index}
							className="font-sans text-xl"
						>
							<a
								href={`#`}
								className="text-blue-500 hover:underline"
								onClick={async (e) => {
									e.preventDefault();
									window.open(`/api/convertToMp3/downloadMP3?file=${file}`, "_blank");
									await fetchFiles();
									await renderFiles(files);
								}}
							>
								{file}
							</a>
						</li>
					))}
				</ul>
			);
			searchBar.disabled = false;
		}
	}

	//onload fetch the files
	useEffect(() => {
		const fetchAndRenderFiles = async () => {
			await fetchFiles();
			await renderFiles(files);
		};
		fetchAndRenderFiles();
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
					id="searchBar"
					onChange={(e) => {
						searchFiles(e.target.value);
					}}
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

		let url = urlBox.value;
		console.log("URL: " + url);

		if (!url) {
			alert("Please enter a URL");
			urlBox.disabled = false;
			downloadButton.disabled = false;
			return;
		}

		alert("Your request is being processed. Please wait...");

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
		await fetchFiles();
		await renderFiles(files);
	}

	function searchFiles(searchTerm: string) {
		console.log("searching for: " + searchTerm);
		let filteredFiles = files.filter((file) => file.toLowerCase().includes(searchTerm.toLowerCase()));
		if (filteredFiles.length === 0) {
			setFilesToRender(<h1 className="font-sans text-xl">No files found</h1>);
			return;
		}
		renderFiles(filteredFiles);
	}
}

//this function is used to test the API and other features
async function GetFiles(): Promise<string[]> {
	let response = await fetch("/api/convertToMp3/getFiles", {
		method: "GET",
	});

	let files: string[] = (await response.json()).files;
	console.log(files);

	return files;
}
