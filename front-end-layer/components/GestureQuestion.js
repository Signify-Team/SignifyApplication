import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import RectangularButton from './RectangularButton';
import { COLORS, FONTS } from '../utils/constants';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

const GestureQuestion = ({ data }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [videoPath, setVideoPath] = useState(null);
    const devices = useCameraDevices();
    const device = devices.find((dev) => dev.position === 'front');
    const cameraRef = React.useRef(null);
    let isRecording = false;

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermission();
            const microphoneStatus = await Camera.requestMicrophonePermission();
            if (cameraStatus === 'granted' && microphoneStatus === 'granted') {
                setHasPermission(true);
            } else {
                setHasPermission(false);
            }
        })();
    }, []);

    const startRecording = async () => {
        try {
            if (!cameraRef.current) return;
            isRecording = true;
            const video = await cameraRef.current.startRecording({
                fileType: 'mp4',
                onRecordingFinished: (video) => {
                    setVideoPath(video.path);
                },
                onRecordingError: (error) => {
                    console.error('Recording error:', error);
                },
            });
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = async () => {
        try {
            if (!cameraRef.current || !isRecording) return;
            await cameraRef.current.stopRecording();
            isRecording = false;
        } catch (error) {
            console.error('Error stopping recording:', error);
        }
    };


    const submitGesture = async () => {
        // save the video and send the video url to the backend
        if (videoPath) {
            console.log('Video saved:', videoPath);
        }

        console.log('Sending gesture to backend...');
        console.log('Video path:', videoPath);
        // send the gesture to the backend
        const response = await fetch('http://192.168.1.134:8000/process-video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoPath }),
        });

        const data = await response.json();
        console.log('Response:', data);
    };

        
    

    if (hasPermission === null) {
        return <Text style={styles.permissionText}>Requesting camera permission...</Text>;
    }

    if (hasPermission === false) {
        return <Text style={styles.permissionText}>No access to camera. Please enable permissions in settings.</Text>;
    }

    if (!device) {
        return <Text style={styles.permissionText}>Loading camera...</Text>;
    }

    return (
        <>
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{data.prompt}</Text>
            </View>
            <View style={styles.gestContainer}>
                {videoPath ? (
                    <Video
                        source={{ uri: `file://${videoPath}` }}
                        style={styles.camera}
                        controls
                    />
                ) : (
                    <Camera
                        ref={cameraRef}
                        style={styles.camera}
                        device={device}
                        isActive={true}
                        video={true}
                    />
                )}
            </View>
            <View style={styles.buttonRow}>
                <RectangularButton
                    width={width * 0.35}
                    color={COLORS.tertiary}
                    text="Start"
                    onPress={startRecording}
                />
                <RectangularButton
                    width={width * 0.35}
                    color={COLORS.highlight_color_2}
                    text="Stop"
                    onPress={stopRecording}
                />
            </View>
            <RectangularButton
                width={width * 0.4}
                text="SUBMIT"
                onPress={submitGesture}
            />
        </>
    );
};

const styles = StyleSheet.create({
    questionContainer: {
        width: width * 0.8,
        marginTop: 0,
        marginBottom: height * 0.01,
    },
    questionText: {
        fontSize: 20,
        fontFamily: FONTS.poppins_font,
        textAlign: 'left',
        color: COLORS.neutral_base_dark,
    },
    gestContainer: {
        width: width * 0.82,
        height: height * 0.58,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
    },
    camera: {
        width: width * 0.75,
        height: height * 0.55,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: height * 0.02,
        gap: width * 0.05,
    },
});

export default GestureQuestion;