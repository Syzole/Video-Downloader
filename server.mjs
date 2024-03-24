import express from 'express';
import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import { ID3Writer } from 'browser-id3-writer';
import * as youtubeSearch from 'youtube-search';
const app = express();
const port = 3000;

app.use(express.static('public'));

const __dirname = path.resolve();
//check if the download directory exists and the mp3, mp4 and spotify subdirectories
if (!fs.existsSync(path.join(__dirname, 'downloads'))) {
    fs.mkdirSync(path.join(__dirname, 'downloads'));
    fs.mkdirSync(path.join(__dirname, 'downloads', 'mp3'));
    fs.mkdirSync(path.join(__dirname, 'downloads', 'mp4'));
    fs.mkdirSync(path.join(__dirname, 'downloads', 'spotify'));
}

const downloadDirectory = path.join(__dirname, 'downloads');// Specify your desired download directory
console.log(__dirname);

app.get('/', (req, res) => {
    res.sendFile('index.html');
});



app.get('/ytmp3', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'ytmp3.html'));
});


app.post('/convertToMp3', express.json(), async (req, res) => {
    //First part is get the url from the request
    let videoUrl = req.body.url;
    let info = await ytdl.getInfo(videoUrl);
    let audioStream = ytdl(videoUrl, { quality: 'highest', filter: 'audioonly' });
    console.log(info.videoDetails.thumbnails[0]);
    let filePath = path.join(downloadDirectory, 'mp3', `${info.videoDetails.title}.mp3`);
    let fileWriteStream = fs.createWriteStream(filePath);
    audioStream.pipe(fileWriteStream);

    //convert to mp3
    fileWriteStream.on('finish', () => {
        res.json({ success: true });
    });

    //now write metadata to the file
    fileWriteStream.on('close', () => {
        let writer = new ID3Writer(fs.readFileSync(filePath));
        writer.setFrame('TIT2', info.videoDetails.title)
            .setFrame('TPE1', [info.videoDetails.author.name])
            .setFrame('APIC', {
                type: 3,
                data: fs.readFileSync(info.videoDetails.thumbnails[0].url),
                description: 'YouTube thumbnail'
            });
    });

});

app.get('/getMp3Files', (req, res) => {
    const mp3Files = fs.readdirSync(path.join(downloadDirectory, 'mp3'));
    res.json({ files: mp3Files });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

