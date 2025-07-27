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
			let files = fs.readdirSync(path.join(directName, "mp3"));
			return NextResponse.json({ files: files }, { status: 200 });

		case "downloadMP3":
			let file = req.nextUrl.searchParams.get("file");
			console.log("file name is: " + file);
			if (!file) {
				return NextResponse.json({ message: "Not a valid file" }, { status: 400 });
			}

			return await downloadToComputer(file);

		default:
			console.log("Invalid ID");
			return NextResponse.json({ message: id }, { status: 400 });
	}
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
	const id = (await params).id;
	console.log(id);

	switch (id) {
		case "downloadMP3":
			console.log("Downloading MP3");
			const { url } = await req.json();
			if (!url) {
				return NextResponse.json({ error: "Please enter a URL" }, { status: 400 });
			}
			let response = await downloadMP3(url);
			return NextResponse.json({ message: response.message }, { status: response.status });

		default:
			console.log("Invalid ID");
			return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
	}
}
//helper functions go here

async function downloadMP3(url: string) {
	try {
		//first check if the URL is valid
		if (!ytdl.validateURL(url)) {
			return { message: "Not a youtube URL", status: 400 };
		}

		//get info and audio stream
		console.log("Getting video info...");
		let info;
		try {
			info = await ytdl.getInfo(url);
		} catch (infoError) {
			console.error("Error getting video info:", infoError);
			return { message: "Could not get video information. The video might be private, age-restricted, or unavailable.", status: 400 };
		}

		console.log("Creating audio stream...");
		let audioStream;
		try {
			audioStream = ytdl(url, {
				quality: "highestaudio",
				filter: "audioonly",
			});
		} catch (streamError) {
			console.error("Error creating audio stream:", streamError);
			return { message: "Could not create audio stream. The video might not have audio or be unavailable.", status: 400 };
		}

		//create file and filename
		let filename = info.videoDetails.title
			.replace(/[<>:"/\\|?*]/g, '_') // Replace invalid filename characters
			.replace(/\s+/g, ' ') // Replace multiple spaces with single space
			.trim(); // Remove leading/trailing spaces

		let filepath = path.join(directName, "mp3", filename + ".mp3");

		//download the audio stream using ffmpeg
		console.log("Starting FFmpeg conversion...");
		try {
			// Download the audio stream using ffmpeg
			await new Promise((resolve, reject) => {
				ffmpeg(audioStream) //input stream
					.audioBitrate(128) //audio bitrate
					.toFormat("mp3") //output format
					.on("end", () => {
						console.log("MP3 conversion completed");
						resolve(undefined);
					}) //when done
					.on("error", (err) => {
						console.error("FFmpeg error:", err);
						reject(err);
					}) //if error occurs reject
					.on("progress", (progress) => {
						console.log("Processing: " + progress.percent + "% done");
					})
					.save(filepath); //save to file
			});

			//add metadata to the mp3 file
			console.log("Adding metadata...");
			let songBuffer = readFileSync(filepath);
			let arrayBuffer = songBuffer.buffer.slice(songBuffer.byteOffset, songBuffer.byteOffset + songBuffer.byteLength);
			let writer = new ID3Writer(arrayBuffer);

			// Add basic metadata first
			writer //set metadata
				.setFrame("TIT2", info.videoDetails.title)
				.setFrame("TPE1", [ info.videoDetails.author.name ])
				.setFrame("TALB", info.videoDetails.title)
				.setFrame("TPE2", info.videoDetails.author.name);

			// Try to add thumbnail, but don't fail if it doesn't work
			try {
				let thumbnailURL = info.videoDetails.thumbnails[ 0 ]?.url;
				if (thumbnailURL) {
					console.log("Adding thumbnail...");
					let thumbnail = await axios.get(thumbnailURL, { responseType: "arraybuffer" });
					let thumbnailBuffer = Buffer.from(thumbnail.data);
					let jpegBuffer = await sharp(thumbnailBuffer).jpeg().toBuffer();

					// Add image separately using the correct method
					writer.setFrame("APIC", {
						type: 3, // 3 is for cover front
						data: jpegBuffer,
						description: "Thumbnail",
					} as any); // Type assertion to bypass TypeScript restriction
				}
			} catch (thumbnailError) {
				console.warn("Could not add thumbnail:", thumbnailError);
				// Continue without thumbnail
			}

			writer.addTag();
			let taggedSongBuffer = Buffer.from((writer as any).arrayBuffer);
			writeFileSync(filepath, new Uint8Array(taggedSongBuffer));

			console.log("MP3 download completed successfully");
			return { message: "Success", status: 200 };

		} catch (ffmpegError) {
			console.error("FFmpeg conversion failed:", ffmpegError);
			return { message: "Failed to convert audio. Please try again or check if the video has audio.", status: 500 };
		}

	} catch (e) {
		console.error("Error in downloadMP3:", e);
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
		const filepath = path.join(directName, "mp3", decodedFile);

		// Check if the file exists
		if (!fs.existsSync(filepath)) {
			return NextResponse.json({ message: "File not found" }, { status: 404 });
		}

		// Read the file as a buffer
		const fileBuffer = readFileSync(filepath);

		// Set response headers
		const headers = {
			"Content-Type": "audio/mpeg",
			// Encode the filename for Content-Disposition header
			"Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(decodedFile)}`,
		};

		//delete file after download
		//fs.unlinkSync(filepath);

		return new Response(fileBuffer, { headers });
	} catch (error) {
		console.error("Error downloading file:", error);
		return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
	}
}