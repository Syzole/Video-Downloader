"use client";

import { useState, useEffect, ReactNode } from "react";

//first set up page

let files: string[] = [];

export default function Page() {
	const [ filesToRender, setFilesToRender ] = useState<ReactNode>(<h1 className="font-sans text-xl">Loading...</h1>);
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
			await setFilesToRender(
				<div className="text-center py-12">
					<div className="text-6xl mb-4">🎬</div>
					<h3 className="text-2xl font-bold text-white mb-2">No Files Yet</h3>
					<p className="text-gray-400">Convert your first YouTube video to MP4!</p>
				</div>
			);
			searchBar.disabled = true;
		} else {
			await setFilesToRender(
				<div className="space-y-3">
					{ array.map((file: string, index: number) => (
						<div
							key={ index }
							className="bg-white/10 hover:bg-white/20 rounded-xl p-4 border border-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3 flex-1 min-w-0">
									<div className="text-2xl">🎬</div>
									<div className="flex-1 min-w-0">
										<p className="text-white font-medium truncate">{ file }</p>
										<p className="text-gray-400 text-sm">MP4 Video File</p>
									</div>
								</div>
								<button
									className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform group-hover:scale-105 flex items-center space-x-2"
									onClick={ async (e) => {
										e.preventDefault();
										window.open(`/api/convertToMp4/downloadMP4?file=${file}`, "_blank");
										await fetchFiles();
										await renderFiles(files);
									} }
								>
									<span>📥</span>
									<span>Download</span>
								</button>
							</div>
						</div>
					)) }
				</div>
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
		<div
			data-theme="dark"
			className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900"
		>
			{/* Header */ }
			<header className="bg-gradient-to-r from-blue-600 to-cyan-600 shadow-2xl">
				<div className="container mx-auto px-6 py-8">
					<div className="flex items-center justify-between">
						<a
							href="/"
							className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg border border-white/20"
						>
							🏠 Home
						</a>
						<div className="text-center">
							<h1 className="text-4xl md:text-5xl font-bold text-white">
								🎬 YouTube to MP4
							</h1>
							<p className="text-blue-100 mt-2">Download videos in high quality</p>
						</div>
						<div className="w-24"></div> {/* Spacer for centering */ }
					</div>
				</div>
			</header>

			{/* Main Content */ }
			<main className="container mx-auto px-6 py-12">
				{/* URL Input Section */ }
				<div className="max-w-4xl mx-auto mb-16">
					<div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
						<div className="text-center mb-8">
							<h2 className="text-3xl font-bold text-white mb-4">
								Enter YouTube URL
							</h2>
							<p className="text-xl text-gray-300 leading-relaxed">
								Paste a{ " " }
								<a
									href="https://www.youtube.com/"
									className="text-blue-400 hover:text-blue-300 underline decoration-blue-400 hover:decoration-blue-300 transition-colors"
									onClickCapture={ (e) => e.preventDefault() }
									onClick={ (e) => window.open(e.currentTarget.href, "_blank") }
								>
									YouTube
								</a>{ " " }
								URL below to download it as an MP4 video file
							</p>
						</div>

						<div className="space-y-6">
							<div className="relative">
								<input
									type="text"
									id="ytUrl"
									placeholder="https://www.youtube.com/watch?v=..."
									className="w-full bg-white/10 border border-white/30 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg backdrop-blur-sm"
								/>
								<div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl pointer-events-none"></div>
							</div>

							<button
								className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-lg"
								onClick={ Download }
								id="downloadButton"
							>
								🎬 Download MP4
							</button>
						</div>

						{/* Quality Options */ }
						<div className="grid md:grid-cols-4 gap-4 mt-8">
							<div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
								<div className="text-xl mb-2">📱</div>
								<p className="text-gray-300 text-sm">480p</p>
							</div>
							<div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
								<div className="text-xl mb-2">💻</div>
								<p className="text-gray-300 text-sm">720p HD</p>
							</div>
							<div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
								<div className="text-xl mb-2">🖥️</div>
								<p className="text-gray-300 text-sm">1080p Full HD</p>
							</div>
							<div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
								<div className="text-xl mb-2">🎯</div>
								<p className="text-gray-300 text-sm">Best Available</p>
							</div>
						</div>
					</div>
				</div>

				{/* Files Section */ }
				<div className="max-w-6xl mx-auto">
					<div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
							<h2 className="text-3xl font-bold text-white mb-4 md:mb-0">
								🎬 Downloaded Videos
							</h2>

							{/* Search Bar */ }
							<div className="relative max-w-md w-full">
								<input
									type="text"
									className="w-full bg-white/10 border border-white/30 rounded-xl px-6 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
									placeholder="Search videos..."
									id="searchBar"
									onChange={ (e) => {
										searchFiles(e.target.value);
									} }
								/>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
								>
									<path
										fillRule="evenodd"
										d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>

						{/* Files List */ }
						<div className="bg-white/5 rounded-2xl p-6 border border-white/10 min-h-[200px]">
							{ filesToRender }
						</div>
					</div>
				</div>
			</main>
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

		let response = await fetch("/api/convertToMp4/downloadMP4", {
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
			setFilesToRender(
				<div className="text-center py-12">
					<div className="text-6xl mb-4">🔍</div>
					<h3 className="text-2xl font-bold text-white mb-2">No Videos Found</h3>
					<p className="text-gray-400">Try adjusting your search terms</p>
				</div>
			);
			return;
		}
		renderFiles(filteredFiles);
	}
}

//this function is used to test the API and other features
async function GetFiles(): Promise<string[]> {
	let response = await fetch("/api/convertToMp4/getFiles", {
		method: "GET",
	});

	let files: string[] = (await response.json()).files;
	console.log(files);

	return files;
}
