/**
 * @file GestureQuestions.js
 * @description Displays the camera feed using react-native-vision-camera.
 *
 * @datecreated 19.12.2024
 * @lastmodified 21.12.2024
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const GestureQuestion = () => {
    const [hasPermission, setHasPermission] = useState(null);
    console.log('hasPermission', hasPermission);

    const devices = useCameraDevices();
    // try to get the front camera
    const device = devices.find((device) => device.position === 'front');
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
        <Text style={styles.permissionText}>Camera feed is displayed.</Text>,
        <View style={styles.gestContainer}>
            <Camera
                style={styles.camera}
                device={device}
                isActive={true}
                video={{ preset: '1080p', fps: 60 }}
                onError={(error) => console.error('Camera error:', error)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    gestContainer: {
        width: 320,
        height: 520,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'navy',
    },
    camera: {
        borderRadius: 15,
        width: 300,
        height: 500,
        color: 'black',
    },
    permissionText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default GestureQuestion;