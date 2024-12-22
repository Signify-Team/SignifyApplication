import React from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';

const VideoDisplay = () => {
  return (
    <View style={styles.container}>
      <Video
        source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}
        style={styles.video}
        controls
        onError={(error) => console.error('Video error:', error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  video: {
    width: 300,
    height: 300,
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,

  },
});

export default VideoDisplay;
