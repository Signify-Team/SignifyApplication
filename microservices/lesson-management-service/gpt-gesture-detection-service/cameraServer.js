const express = require('express');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

const app = express();

// FFMPEG path
ffmpeg.setFfmpegPath(ffmpegPath);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'cameraRecorder.html'));
});

// Saves the video as a video.webm file in the directory.
app.post('/save-video', (req, res) => {
    const filePath = path.join(__dirname, 'video.webm');
    const writeStream = fs.createWriteStream(filePath);

    req.pipe(writeStream);
    req.on('end', () => {
        res.send('Video saved');
        // Extract keyframes 
        extractKeyFrames(filePath, path.join(__dirname, 'keyframes'));
    });

    req.on('error', (err) => {
        console.error(err);
        res.status(500).send('Error saving video');
    });
});

// Method: Extract Keyframes - Extracts the keyframes from the saved video.
const extractKeyFrames = (videoPath, outputDir) => {
    return new Promise((resolve, reject) => {
        if(!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir, {recursive: true});
        }

        ffmpeg(videoPath)
            .output(path.join(outputDir, 'keyframe-%04d.jpg'))
            .outputOptions('-vf', 'fps=5') // Extract keyframes at 5 fps
            .on('end', () => {
                console.log('Keyframes extracted');
                resolve();
            })
            .on('error', (err) => {
                console.error('Error extracting keyframes:', err);
                reject(err);
            })
            .run();
    });
};

// Serves on port 3001
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Camera server is running on port ${PORT}`);
});
