import express from "express";
import ytdl from "ytdl-core";
import fs, { readFileSync, writeFileSync } from "fs";
import path from "path";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";
import { ID3Writer } from "browser-id3-writer";
import axios from "axios";
import sharp from "sharp";

const app = express();
const port = 3000;

app.use(express.static("public"));

const __dirname = path.resolve();
//check if the download directory exists and the mp3, mp4 and spotify subdirectories
if (!fs.existsSync(path.join(__dirname, "downloads"))) {
	fs.mkdirSync(path.join(__dirname, "downloads"));
	fs.mkdirSync(path.join(__dirname, "downloads", "mp3"));
	fs.mkdirSync(path.join(__dirname, "downloads", "mp4"));
	fs.mkdirSync(path.join(__dirname, "downloads", "spotify"));
}

const downloadDirectory = path.join(__dirname, "downloads"); // Specify your desired download directory

app.get("/", (req, res) => {
	res.sendFile("index.html");
});

app.get("/ytmp3", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "ytmp3.html"));
});

app.post("/convertToMp3", express.json(), async (req, res) => {
	//First part is get the url from the request
	let videoUrl = req.body.url;

	//Get the video info
	let info = await ytdl.getInfo(videoUrl);
	let audioStream = await ytdl(videoUrl, {
		quality: "highest",
		filter: "audioonly",
	});

	let fileName = info.videoDetails.title;
	let filePath = path.join(downloadDirectory, "mp3", `${fileName}.mp3`);

    //the spawn function is used to run the ffmpeg binary from within the nodejs environment, kinda cool right?
	const ffmpeg = await spawn(ffmpegPath, [
		"-i",
		"pipe:0", // Use pipe to read input from stdin
		"-codec:a",
		"libmp3lame", // Set the audio codec to MP3
		"-q:a",
		"0", // Set the audio quality (0 is the highest quality)
		filePath, // Output file path
	]);

	audioStream.pipe(ffmpeg.stdin);

	// Handle ffmpeg process events
	ffmpeg.on("error", (err) => {
		console.error("Error running ffmpeg:", err);
		res.json({
			success: false,
			error: "An error occurred while converting the audio.",
		});
	});

	ffmpeg.on("close", async () => {
		console.log("Audio conversion completed successfully.");
		let songBuffer = readFileSync(filePath);
		let writer = new ID3Writer(songBuffer);

		// console.log(info.videoDetails.title);
		// console.log(info.videoDetails.author.name);

		let thumbnailURL = info.videoDetails.thumbnails[0].url;
		let thumbnail = await axios.get(thumbnailURL, {
			responseType: "arraybuffer",
		});
		let thumbnailBuffer = Buffer.from(thumbnail.data);

		// Convert the thumbnail to jpeg and get the buffer of that
		let jpegBuffer = await sharp(thumbnailBuffer).jpeg().toBuffer();

		writer
			.setFrame("TIT2", info.videoDetails.title)
			.setFrame("TPE1", [info.videoDetails.author.name])
			.setFrame("TALB", info.videoDetails.title)
			.setFrame("TPE2", info.videoDetails.author.name)
			.setFrame("APIC", {
				type: 3,
				data: jpegBuffer,
				description: "Thumbnail",
			});
		res.json({ success: true });
		writer.addTag();

		let taggedSongBuffer = Buffer.from(writer.arrayBuffer);
		await writeFileSync(filePath, taggedSongBuffer);
	});
});

app.post("/convertToMp4", express.json(), async (req, res) => {
	let videoUrl = req.body.url;
	let info = await ytdl.getInfo(videoUrl);
	let fileName = info.videoDetails.title;
	let filePath = path.join(downloadDirectory, "mp4", `${fileName}.mp4`);
	
});

app.get("/getMp3Files", (req, res) => {
	const mp3Files = fs.readdirSync(path.join(downloadDirectory, "mp3"));
	res.json({ files: mp3Files });
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
