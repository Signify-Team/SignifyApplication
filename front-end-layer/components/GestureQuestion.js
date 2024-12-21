/**
 * @file GestureQuestions.js
 * @description Displays the camera feed using react-native-vision-camera.
 *
 * @datecreated 19.12.2024
 * @lastmodified 21.12.2024
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import RectangularButton from './RectangularButton';
import { COLORS, FONTS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

const GestureQuestion = ({data}) => {
    const [hasPermission, setHasPermission] = useState(null);
    console.log('hasPermission', hasPermission);

    const devices = useCameraDevices();
    // try to get the front camera
    const device = devices.find((dev) => dev.position === 'front');
    console.log('device', device === null ? 'No front camera found.' : 'device found');

    // Request permissions for camera and microphone
    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermission();
            if (cameraStatus === 'granted') {
                setHasPermission(true);
                console.log('Camera permission granted.');
            } else {
                setHasPermission(false);
            }
        })();
    }, []);

    if (hasPermission === null) {
        console.log('Requesting camera permission...');
        return <Text style={styles.permissionText}>Requesting camera permission...</Text>;
    }

    if (hasPermission === false) {
        console.log('No access to camera. Please enable permissions in settings.');
        return <Text style={styles.permissionText}>No access to camera. Please enable permissions in settings.</Text>;
    }

    if (!device) {
        console.log('No front camera found.');
        return <Text style={styles.permissionText}>Loading camera...</Text>;
    }

    return (
        console.log('Camera feed is displayed.'),
        <>
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{data.prompt}</Text>
            </View>
            <View style={styles.gestContainer}>
                <Camera
                    style={styles.camera}
                    device={device}
                    isActive={true}
                    video={{ preset: '1080p', fps: 60 }}
                    onError={(error) => console.error('Camera error:', error)}
                />
            </View>
            <View style={styles.buttonRow}>
                <RectangularButton
                    width={width * 0.35}
                    color={COLORS.tertiary}
                    text="Start"
                />
                <RectangularButton
                    width={width * 0.35}
                    color={COLORS.highlight_color_2}
                    text="Stop"
                />
            </View>
            <RectangularButton
                width={width * 0.4}
                text="SUBMIT"
            />
        </>
    );
};

const styles = StyleSheet.create({
    questionContainer: {
        width: width * 0.8,
        alignItems: 'flex-start',
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
