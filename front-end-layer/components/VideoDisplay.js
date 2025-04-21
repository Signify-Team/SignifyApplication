/**
 * @file VideoDisplay.js
 * @description Displays video for multi choice answer.
 *
 * @datecreated 22.12.2024
 * @lastmodified 22.12.2024
 */

import React from 'react';
import { View } from 'react-native';
import Video from 'react-native-video';
import styles from '../styles/VideoDisplayStyles';

const VideoDisplay = ({sourceVid, customStyle, customContainerStyle}) => {
  // Handle both URLs and require() - in the future we can remove for require() sources
  const videoSource = typeof sourceVid === 'string'
    ? { uri: sourceVid }
    : sourceVid;

  if (!sourceVid) {
    console.warn('No video source provided to VideoDisplay');
    return null;
  }

  return (
    <View style={customContainerStyle || styles.container}>
      <Video
        source={videoSource}
        style={customStyle || styles.video}
        controls={true}
        resizeMode="cover"
        onError={(error) => console.error('Video error:', error, sourceVid)}
      />
    </View>
  );
};

export default VideoDisplay;
