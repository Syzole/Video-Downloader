"use server";

import { NextRequest, NextResponse } from "next/server";

import axios from "axios";
import { ID3Writer } from "browser-id3-writer";
import ffmpeg from "fluent-ffmpeg";
import fs, { readFileSync, writeFileSync } from "fs";
import path from "path";
import sharp from "sharp";
import ytdl from "@distube/ytdl-core";

const directName = path.resolve("./downloads");
const ffmpegPath = path.resolve("./app/api/ffmpeg/ffmpeg.exe");
// console.log("Manually set ffmpeg path:", ffmpegPath);
ffmpeg.setFfmpegPath(ffmpegPath);

//create the downloads folder if it doesn't exist

if (!fs.existsSync(directName)) {
	fs.mkdirSync(directName);
	fs.mkdirSync(path.join(directName, "mp3"));
	fs.mkdirSync(path.join(directName, "mp4"));
	fs.mkdirSync(path.join(directName, "spotify"));
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	const id = (await params).id;
	switch (id) {
		case "getFiles":
			let files = fs.readdirSync(path.join(directName, "mp4"));
			return NextResponse.json({ files: files }, { status: 200 });

		case "downloadMP4":
			let file = req.nextUrl.searchParams.get("file");
			console.log("file name is: " + file);
			if (!file) {
				return NextResponse.json({ message: "Not a valid file" }, { status: 400 });
			}

			return await downloadToComputer(file);

		default:
			console.log("Invalid ID");
			return NextResponse.json({ message: "Invalid route for this api" }, { status: 400 });
	}
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
	const id = (await params).id;
	console.log(id);

	switch (id) {
		case "downloadMP4":
			const { url } = await req.json();
			if (!url) {
				return NextResponse.json({ error: "Please enter a URL" }, { status: 400 });
			}
			let response = await downloadMP4(url);
			return NextResponse.json({ message: response.message }, { status: response.status });

		default:
			console.log("Invalid ID");
			return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
	}
}

//helper functions go here

async function downloadMP4(url: string) {
	try {
		if (!ytdl.validateURL(url)) {
			return { message: "Not a valid YouTube URL", status: 400 };
		}

		console.log("Getting video info...");
		let info;
		try {
			info = await ytdl.getInfo(url);
		} catch (infoError) {
			console.error("Error getting video info:", infoError);
			return { message: "Could not get video information. The video might be private, age-restricted, or unavailable.", status: 400 };
		}

		console.log("Creating video stream...");
		let stream;
		try {
			stream = ytdl(url, {
				quality: "highestvideo",
				filter: "audioandvideo",
			});
		} catch (streamError) {
			console.error("Error creating video stream:", streamError);
			return { message: "Could not create video stream. The video might be unavailable.", status: 400 };
		}

		//create file/filename
		let filename = info.videoDetails.title
			.replace(/[<>:"/\\|?*]/g, '_') // Replace invalid filename characters
			.replace(/\s+/g, ' ') // Replace multiple spaces with single space
			.trim(); // Remove leading/trailing spaces

		let filepath = path.join(directName, "mp4", filename + ".mp4");

		//download the video using ffmpeg
		console.log("Starting FFmpeg conversion...");
		try {
			await new Promise((resolve, reject) => {
				ffmpeg(stream)
					.outputOptions([ "-c:v copy", "-c:a copy" ])
					.output(filepath)
					.on("end", () => {
						console.log("MP4 download completed");
						resolve(undefined);
					})
					.on("error", (err) => {
						console.error("FFmpeg error:", err);
						reject(err);
					})
					.on("progress", (progress) => {
						console.log("Processing: " + progress.percent + "% done");
					})
					.run();
			});

			console.log("MP4 download completed successfully");
			return { message: "Success", status: 200 };

		} catch (ffmpegError) {
			console.error("FFmpeg conversion failed:", ffmpegError);
			return { message: "Failed to download video. Please try again or check if the video is available.", status: 500 };
		}

	} catch (e) {
		console.error("Error in downloadMP4:", e);
		if (e instanceof Error) {
			if (e.message.includes("Could not extract functions")) {
				return { message: "YouTube extraction failed. This might be due to YouTube changes. Please try again later.", status: 500 };
			}
			return { message: `Error: ${e.message}`, status: 500 };
		}
		return { message: "Unknown error occurred", status: 500 };
	}
}

async function downloadToComputer(file: string) {
	//use URI encoding to handle special characters
	try {
		// Decode file name to handle special characters
		const decodedFile = decodeURIComponent(file);

		// Construct the file path
		const filepath = path.join(directName, "mp4", decodedFile);

		// Check if the file exists
		if (!fs.existsSync(filepath)) {
			return NextResponse.json({ message: "File not found" }, { status: 404 });
		}

		// Read the file as a buffer
		const fileBuffer = readFileSync(filepath);

		// Set response headers
		const headers = {
			"Content-Type": "video/mp4",
			// Encode the filename for Content-Disposition header
			"Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(decodedFile)}`,
		};

		//delete file after download (optional)
		//fs.unlinkSync(filepath);

		return new Response(fileBuffer, { headers });
	} catch (error) {
		console.error("Error downloading file:", error);
		return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
