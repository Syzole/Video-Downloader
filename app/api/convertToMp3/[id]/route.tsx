"use server";

import { NextRequest, NextResponse } from "next/server";

import axios from "axios";
import { ID3Writer } from "browser-id3-writer";
import ffmpeg from "fluent-ffmpeg";
import fs, { readFileSync, writeFileSync } from "fs";
import path from "path";
import sharp from "sharp";
import ytdl from "ytdl-core";

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
	const id = params.id;
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
	const id = params.id;
	console.log(id);

	switch (id) {
		case "downloadMP3":
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
	//console.log(url);

	//first check if the URL is valid
	if (!ytdl.validateURL(url)) {
		return { message: "Not a youtube URL", status: 400 };
	}

	//get info and auido stream
	let info = await ytdl.getInfo(url);
	let audioStream = await ytdl(url, {
		quality: "highestaudio",
		filter: "audioonly",
	});

	//create file and filename
	let filename = info.videoDetails.title;
	let filepath = path.join(directName, "mp3", filename + ".mp3");

	//download the audio stream using ffmpeg

	try {
		// Download the audio stream using ffmpeg
		await new Promise((resolve, reject) => {
			ffmpeg(audioStream) //input stream
				.audioBitrate(128) //audio bitrate
				.toFormat("mp3") //output format
				.on("end", resolve) //when done
				.on("error", reject) //if error occurs reject
				.save(filepath); //save to file
		});

		//add metadata to the mp3 file
		let songBuffer = readFileSync(filepath);
		let writer = new ID3Writer(songBuffer);

		//console.log(info.videoDetails.title);
		//console.log(info.videoDetails.author.name);

		let thumbnailURL = info.videoDetails.thumbnails[0].url;
		let thumbnail = await axios.get(thumbnailURL, { responseType: "arraybuffer" });

		let thumbnailBuffer = Buffer.from(thumbnail.data);

		let jpegBuffer = await sharp(thumbnailBuffer).jpeg().toBuffer();

		writer //set metadata
			.setFrame("TIT2", info.videoDetails.title)
			.setFrame("TPE1", [info.videoDetails.author.name])
			.setFrame("TALB", info.videoDetails.title)
			.setFrame("TPE2", info.videoDetails.author.name)
			.setFrame("APIC", {
				type: 3,
				data: jpegBuffer,
				description: "Thumbnail",
			});

		writer.addTag();
		//console.log(writer);
		let taggedSongBuffer = Buffer.from((writer as any).arrayBuffer); // Type assertion(funny typescript stuff)
		await writeFileSync(filepath, taggedSongBuffer);
	} catch (e) {
		console.log(e);
		return { message: e, status: 500 };
	}

	return { message: "Sucess", status: 200 };
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