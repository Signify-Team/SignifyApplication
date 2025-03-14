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

const VideoDisplay = ({sourceVid}) => {
  return (
    <View style={styles.container}>
      <Video
        source={sourceVid}
        style={styles.video}
        controls
        onError={(error) => console.error('Video error:', error)}
      />
    </View>
  );
};

export default VideoDisplay;
