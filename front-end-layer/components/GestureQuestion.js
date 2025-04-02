/**
 * @file A component that displays a question prompt and a camera view for the user to record a gesture.
 * @description Asks the user to open up the camera and asks a gesture question.
 *
 * @datecreated 19.12.2024
 * @lastmodified 22.12.2024
 * 
 * @param {Object} data - The data object containing the question prompt.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Modal } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import RectangularButton from './RectangularButton';
import { COLORS, FONTS } from '../utils/constants';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

const GestureQuestion = ({ data, onSubmit, onComplete }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [videoPath, setVideoPath] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const devices = useCameraDevices();
    const device = devices.find((dev) => dev.position === 'front');
    const cameraRef = React.useRef(null);
    let isRecording = false;
    const [isCorrect, setIsCorrect] = useState(false); 

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
        if (!videoPath) {
            console.error("No video path available.");
            return;
        }
    
        const formData = new FormData();
        formData.append('file', {
            uri: videoPath,
            name: 'gesture.mp4',
            type: 'video/mp4',
        });
    
        console.log('Sending gesture to backend...');
        console.log('Video path:', videoPath);
    
        try {
            const response = await fetch('http://192.168.0.16:8000/upload-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
    
            const { video_server_path } = await response.json();
            console.log('Video uploaded to:', video_server_path);
    
            // Proceed to process the video after uploading
            const processResponse = await fetch('http://192.168.0.16:8000/process-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ video_url: video_server_path }),
            });
    
            const result = await processResponse.json();
            console.log('Processed result:', result);

            // if the gpt response contains the word "yes", the gesture is correct, so we can display a success message on the screen
            if (result.includes("yes")) {
                setIsCorrect(true);
                setIsModalVisible(true);
                setModalMessage("Gesture is correct!");
                console.log("Gesture is correct!");
            } else {
                setIsCorrect(false);
                setIsModalVisible(true);
                setModalMessage("Gesture is incorrect.");
                console.log("Gesture is incorrect.");
            }

        } catch (error) {
            console.error('Error during gesture submission:', error);
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
        if (onComplete) {
            onComplete(); // Notify parent component to proceed to the next lesson
        }
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
                <Text style={styles.questionText}>{data.prompt || data.word}</Text>
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
            <View style={styles.bottomButtonsContainer}>
                <RectangularButton
                    width={width * 0.4}
                    text="SUBMIT"
                    onPress={submitGesture}
                />
                <RectangularButton
                    width={width * 0.4}
                    text="SKIP"
                    color={COLORS.soft_pink_background}
                    onPress={onComplete}
                />
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <RectangularButton
                            width={width * 0.4}
                            text="Continue"
                            color={isCorrect ? COLORS.tertiary : COLORS.highlight_color_2}
                            onPress={closeModal}
                        />
                    </View>
                </View>
            </Modal>
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
    bottomButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: width * 0.05,
        marginBottom: height * 0.02,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: width * 0.8,
        padding: 20,
        backgroundColor: COLORS.light_gray_1,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        fontFamily: FONTS.poppins_font,
        textAlign: 'center',
        color: COLORS.neutral_base_dark,
    },
    permissionText: {
        fontSize: 18,
        textAlign: 'center',
        color: COLORS.neutral_base_dark,
        marginTop: height * 0.4,
    },
});

export default GestureQuestion;