import express from 'express';
import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import { ID3Writer } from 'browser-id3-writer';
const app = express();
const port = 3000;

app.use(express.static('public'));

const __dirname = path.resolve();
//const downloadDirectory = path.join(__dirname, 'downloads');// Specify your desired download directory
console.log(__dirname);

app.get('/', (req, res) => {
    res.sendFile('index.html');
});



app.get('/ytmp3', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/convertToMp3', express.json(), async (req, res) => {
    //First part is get the url from the request
    const videoUrl = req.body.url;
    const info = await ytdl.getInfo(videoUrl);
    const audioStream = ytdl(videoUrl, { quality: 'highest', filter: 'audioonly' });
    console.log(info);
    const filePath = path.join(downloadDirectory, 'mp3', `${info.videoDetails.title}.mp3`);
    const fileWriteStream = fs.createWriteStream(filePath);
    audioStream.pipe(fileWriteStream);

    //convert to mp3
    fileWriteStream.on('finish', () => {
        res.json({ success: true });
    });

    //now write metadata to the file


});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

