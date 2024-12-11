require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const axios = require('axios');


const app = express();

// OPEN AI API KEY
const API_KEY = process.env.OPENAI_API_KEY;

if(!API_KEY){
    console.error('API key not found');
    process.exit(1);
}

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
    const videoPath = path.join(__dirname, 'video.webm');
    const outputDir = path.join(__dirname, 'keyframes');
    const writeStream = fs.createWriteStream(videoPath);

    req.pipe(writeStream);
    req.on('end', async () => {
        console.log('Video saved');
        res.send('Video saved');
        // Extract keyframes
        try {
            await extractKeyFrames(videoPath, outputDir);

            // Read keyframes
            const keyframes = fs.readdirSync(outputDir)
                .filter(file => file.endsWith('.jpg'))
                .map(file => fs.readFileSync(path.join(outputDir, file), 'base64'));

            // Send keyframes to GPT
            const gptResponse = await sendKeyFramesToGPT(keyframes);
            console.log('Keyframes sent to GPT:', gptResponse);
            res.send({message: 'Keyframes sent to GPT', response: gptResponse});
        }
        catch(error){
            console.error('Error extracting keyframes:', error);
            res.status(500).send('Error extracting keyframes');
        }
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
            .outputOptions('-vf', 'fps=4') // Extract keyframes at 5 fps
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

// Method: Send Keyframes to GPT - Sends the keyframes to the GPT model.
const sendKeyFramesToGPT = async (keyframes) => {
    try {
        // console.log('Sending API key in header:', `Bearer ${API_KEY}`);
        console.log('Payload size (bytes):', JSON.stringify(keyframes).length);

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are a image processing and sign language translation expert. Analyze the following keyframes and provide what they might mean.',
                },
                {
                    role: 'user',
                    content: `Here are Base64-encoded images: ${keyframes.join(', ')}`,
                },
            ],
        },
        {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    catch(error){
        console.error('Error sending keyframes to GPT:', error);
        throw error;
    }
};

// Serves on port 3001
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Camera server is running on port ${PORT}`);
});
