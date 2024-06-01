"use server";

import { NextResponse } from "next/server";

import ytdl from "ytdl-core";
import fs, { readFileSync, writeFileSync } from "fs";
import path from "path";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";
import { ID3Writer } from "browser-id3-writer";
import axios from "axios";
import sharp from "sharp";
import { use } from "react";

const directName = path.resolve("./downloads");

//create the downloads folder if it doesn't exist

if (!fs.existsSync(directName)) {
	fs.mkdirSync(directName);
	fs.mkdirSync(path.join(directName, "mp3"));
	fs.mkdirSync(path.join(directName, "mp4"));
	fs.mkdirSync(path.join(directName, "spotify"));
}

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const id = params.id;
	return NextResponse.json({ id: id });
}

export async function POST(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const id = params.id;
	console.log(id);
	console.log(await req.formData());

	switch (id) {
		case "downloadMP3":
			const { url } = await req.json();
			if (!url) {
				return NextResponse.json(
					{ error: "Please enter a URL" },
					{ status: 400 }
				);
			}
			await downloadMP3(url);
			return NextResponse.json({ message: "Downloaded MP3" }, { status: 200 });
		default:
			console.log("Invalid ID");
			return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
	}
}
//helper functions go here

async function downloadMP3(url: string) {
	console.log(url);
	return "this is more of a placeholder for now";
}
