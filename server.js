const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const ID3Writer = require('browser-id3-writer');

const app = express();
const port = 3000;

app.use(express.static('public'));

const downloadDirectory = path.join(__dirname, 'downloads'); // Specify your desired download directory

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'index.html'));
});



app.get('/ytmp3', (req,res) => {
    res.sendFile(path.join(__dirname,'public', 'ytmp3.html'));
});


//this was for testing
app.get('/download', (req, res) => {
    const videoUrl = 'http://www.youtube.com/watch?v=aqz-KE-bpKQ';
    const videoStream = ytdl(videoUrl, { quality: 'highest' });

    const filePath = path.join(downloadDirectory, 'video.mp4');
    const fileWriteStream = fs.createWriteStream(filePath);

    videoStream.pipe(fileWriteStream);

    fileWriteStream.on('finish', () => {
        res.setHeader('Content-Disposition', `attachment; filename="video.mp4"`);
        res.sendFile(filePath, {}, () => {
            fs.unlinkSync(filePath); // Delete the file after it has been sent
            alert("Download Complete");
        });
    });
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

