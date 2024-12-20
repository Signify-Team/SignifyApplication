/**
 * @file GestureQuestions.js
 * @description Asks the user to open up the camera and asks a gesture question.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React from 'react';
import { View, Text, Button } from 'react-native';
import styles from '../styles/QuestionStyles';
// import { Camera } from 'expo-camera';

const GestureQuestion = ({ data, onAnswer }) => {
    // const [hasPermission, setHasPermission] = React.useState(null);

    // React.useEffect(() => {
    //     (async () => {
    //         const { status } = await Camera.requestCameraPermissionsAsync();
    //         setHasPermission(status === 'granted');
    //     })();
    // }, []);

    // if (hasPermission === null) {
    //     return <Text>Requesting camera permission...</Text>;
    // }

    // if (hasPermission === false) {
    //     return <Text>No access to camera</Text>;
    // }

    return (
        <View style={styles.gestContainer}>
            <Text style={styles.prompt}>{data.prompt}</Text>
            {/* <Camera style={styles.camera} /> */}
            <Button title="Submit Gesture" onPress={() => onAnswer('gestureCaptured')} />
        </View>
    );
};

export default GestureQuestion;
