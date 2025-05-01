/**
 * @file VideoDisplay.js
 * @description Displays video for multi choice answer.
 *
 * @datecreated 22.12.2024
 * @lastmodified 22.12.2024
 */

import React, { useState, useRef } from 'react';
import { View, Image, Animated, Text } from 'react-native';
import Video from 'react-native-video';
import styles from '../styles/VideoDisplayStyles';
import KoalaHand from '../assets/icons/header/koala-hand.png';

const VideoDisplay = ({sourceVid, customStyle, customContainerStyle}) => {
  const [hasError, setHasError] = useState(false);
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Handle both URLs and require() - in the future we can remove for require() sources
  const videoSource = typeof sourceVid === 'string'
    ? { uri: sourceVid }
    : sourceVid;

  if (!sourceVid) {
    return null;
  }

  return (
    <View style={customContainerStyle || styles.container}>
      {hasError ? (
        <View style={styles.koalaHandContainer}>
          <Animated.View
            style={{
              transform: [
                {
                  translateY: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
              ],
            }}
          >
            <Image source={KoalaHand} style={styles.koalaHand} />
          </Animated.View>
          <Text style={styles.messageText}>
            Video is currently unavailable. Our team is working to resolve this issue.
          </Text>
        </View>
      ) : (
        <Video
          source={videoSource}
          style={customStyle || styles.video}
          controls={true}
          resizeMode="cover"
          onError={() => setHasError(true)}
        />
      )}
    </View>
  );
};

export default VideoDisplay;
