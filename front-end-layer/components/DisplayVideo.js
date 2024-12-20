/**
 * @file DisplayVideo.js
 * @description Displays a video inside multiple choice component.
 *
 * @datecreated 20.12.2024
 * @lastmodified 20.12.2024
 */

import React from 'react';
import Video from 'react-native-video';
import exVid from '../assets/videos/example.mp4';

console.log('Video file path:', require('../assets/videos/example.mp4'));
const sintel = require('../assets/videos/example.mp4');

const DisplayVideo = () => {
    return (
        <Video
            source={{uri: sintel}}
            style={{ width: 300, height: 300 }}
            controls={true}
        />
    );
};

export default DisplayVideo;
