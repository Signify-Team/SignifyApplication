const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const videoElement = document.getElementById('camera');

let mediaRecorder;
let keyFrames = [];

async function startCamera(){
    try{
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
        videoElement.srcObject = stream;

        // Create MediaRecorder -- disregard the error as it works on the web it gives an error here.
        mediaRecorder = new MediaRecorder(stream, {mimeType: 'video/webm'});

        // Create keyframes
        mediaRecorder.ondataavailable = (event) => {
            if(event.data.size > 0){
                keyFrames.push(event.data);
            }
        };

        // Recording stops
        mediaRecorder.onstop = async () => {
            const blob = new Blob(keyFrames, {type: 'video/webm'});
            const videoBuffer = await blob.arrayBuffer();

            // Save
            fetch('http://localhost:3001/save-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
                body: videoBuffer,
            })
                .then((response) => response.text())
                .then((result) => console.log('video saved', result))
                .catch((error) => console.error('Error:', error));
            };
    }
    catch(err){
        console.error('Error:', err);
    }
}

startButton.addEventListener('click', () => {
    keyFrames = [];
    mediaRecorder.start();
    startButton.disabled = true;
    stopButton.disabled = false;
});

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
});

startCamera();
