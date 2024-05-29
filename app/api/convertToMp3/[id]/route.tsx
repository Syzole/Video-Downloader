"use server";

import { NextResponse} from "next/server";

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


export async function GET(request: Request, { params }: { params: { id: string } }) {
	const  id  = params.id;

	return NextResponse.json({id: id});
}

export async function POST(req: Request) {
	return NextResponse.json({});
}

//helper functions go here