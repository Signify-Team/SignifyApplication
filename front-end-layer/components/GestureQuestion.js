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
import { COLORS, FONTS, API, GESTURE_UI } from '../utils/constants';
import Video from 'react-native-video';
import { playPrimaryButtonSound } from '../utils/services/soundServices';

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
        playPrimaryButtonSound();
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
        playPrimaryButtonSound();
        try {
            if (!cameraRef.current || !isRecording) return;
            await cameraRef.current.stopRecording();
            isRecording = false;
        } catch (error) {
            console.error('Error stopping recording:', error);
        }
    };

    const submitGesture = async () => {
        playPrimaryButtonSound();
        if (!videoPath) {
            setIsModalVisible(true);
            setModalMessage("No video recorded. Please record a video first.");
            return;
        }
    
        setIsModalVisible(true);
        setModalMessage("Processing your gesture...");
    
        const formData = new FormData();
        formData.append('file', {
            uri: videoPath,
            name: 'gesture.mp4',
            type: 'video/mp4',
        });
    
        try {
            // Upload video with timeout
            const uploadResponse = await Promise.race([
                fetch(`${API.GESTURE_SERVICE_URL}/upload-video`, {
                    method: 'POST',
                    body: formData,
                }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Upload timeout')), API.UPLOAD_TIMEOUT)
                )
            ]);
    
            if (!uploadResponse.ok) {
                throw new Error('Failed to upload video');
            }
    
            const uploadResult = await uploadResponse.json();
    
            // Process video with timeout
            const processResponse = await Promise.race([
                fetch(`${API.GESTURE_SERVICE_URL}/process-video`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        video_url: uploadResult.video_server_path,
                        target_word: data.word || data.prompt
                        // print the target word to the console
                    }),
                }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Processing timeout')), API.PROCESS_TIMEOUT)
                )
            ]);
            console.log('Target word:', data.word || data.prompt);
    
            if (!processResponse.ok) {
                throw new Error('Failed to process video');
            }
    
            const result = await processResponse.json();
            console.log('Server response:', result);
    
            if (result.status === 'error') {
                throw new Error(result.message);
            }
    
            const isCorrect = result.analysis.answer === 'yes';  // note: lowercase 'yes'

            setIsCorrect(isCorrect);
            setModalMessage(isCorrect
                ? "Correct! Your gesture was recognized successfully!"
                : `Incorrect. ${result.analysis.feedback || "Please try again or skip to continue."}`
            );

    
            // Call onSubmit with the result
            if (onSubmit) {
                onSubmit(isCorrect);
            }
    
        } catch (error) {
            console.error('Error:', error);
            setIsCorrect(false);
            setModalMessage("An error occurred. Please try again.");
    
            // Call onSubmit with false on error
            if (onSubmit) {
                onSubmit(false);
            }
        }
    };
    

    const closeModal = () => {
        setIsModalVisible(false);
        if (isCorrect && onComplete) {
            onComplete(); // continue if correct
        } else {
            // make sure we can record again when close is pressed
            setVideoPath(null);
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
                    width={width * GESTURE_UI.BUTTON_WIDTH}
                    color={COLORS.tertiary}
                    text="Start"
                    onPress={startRecording}
                />
                <RectangularButton
                    width={width * GESTURE_UI.BUTTON_WIDTH}
                    color={COLORS.highlight_color_2}
                    text="Stop"
                    onPress={stopRecording}
                />
            </View>
            <View style={styles.bottomButtonsContainer}>
                <RectangularButton
                    width={width * GESTURE_UI.SUBMIT_BUTTON_WIDTH}
                    text="SUBMIT"
                    onPress={submitGesture}
                />
                <RectangularButton
                    width={width * GESTURE_UI.SUBMIT_BUTTON_WIDTH}
                    text="SKIP"
                    color={COLORS.soft_pink_background}
                    onPress={() => {
                        playPrimaryButtonSound();
                        onComplete();
                    }}
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
                            width={width * GESTURE_UI.SUBMIT_BUTTON_WIDTH}
                            text={isCorrect ? "Continue" : "Close"}
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
        width: width * GESTURE_UI.QUESTION_WIDTH,
        marginTop: 0,
        marginBottom: height * GESTURE_UI.QUESTION_MARGIN_BOTTOM,
    },
    questionText: {
        fontSize: GESTURE_UI.QUESTION_FONT_SIZE,
        fontFamily: FONTS.poppins_font,
        textAlign: 'left',
        color: COLORS.neutral_base_dark,
    },
    gestContainer: {
        width: width * GESTURE_UI.GEST_CONTAINER_WIDTH,
        height: height * GESTURE_UI.GEST_CONTAINER_HEIGHT,
        borderRadius: GESTURE_UI.GEST_CONTAINER_BORDER_RADIUS,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
    },
    camera: {
        width: width * GESTURE_UI.CAMERA_WIDTH,
        height: height * GESTURE_UI.CAMERA_HEIGHT,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: height * GESTURE_UI.BUTTON_MARGIN_VERTICAL,
        gap: width * GESTURE_UI.BUTTON_GAP,
    },
    bottomButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: width * GESTURE_UI.BUTTON_GAP,
        marginBottom: height * GESTURE_UI.BUTTON_MARGIN_VERTICAL,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: width * GESTURE_UI.MODAL_WIDTH,
        padding: GESTURE_UI.MODAL_PADDING,
        backgroundColor: COLORS.light_gray_1,
        borderRadius: GESTURE_UI.MODAL_BORDER_RADIUS,
        alignItems: 'center',
    },
    modalText: {
        fontSize: GESTURE_UI.MODAL_FONT_SIZE,
        marginBottom: GESTURE_UI.MODAL_TEXT_MARGIN_BOTTOM,
        fontFamily: FONTS.poppins_font,
        textAlign: 'center',
        color: COLORS.neutral_base_dark,
    },
    permissionText: {
        fontSize: GESTURE_UI.PERMISSION_FONT_SIZE,
        textAlign: 'center',
        color: COLORS.neutral_base_dark,
        marginTop: height * GESTURE_UI.PERMISSION_TEXT_MARGIN_TOP,
    },
});

export default GestureQuestion;