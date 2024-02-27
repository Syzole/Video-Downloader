const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

