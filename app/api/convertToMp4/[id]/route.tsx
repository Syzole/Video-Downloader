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
			return NextResponse.json({ message: id }, { status: 400 });
	}
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
	const id = params.id;
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