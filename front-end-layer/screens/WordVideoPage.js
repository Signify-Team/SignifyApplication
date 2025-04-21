/**
 * @file WordVideoPage.js
 * @description Displays sign video for a selected dictionary word.
 *
 * @datecreated 21.04.2025
 * @lastmodified 21.04.2025
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import VideoDisplay from '../components/VideoDisplay';
import BackIcon from '../assets/icons/header/back.png';
import VideoDisplayStyles from '../styles/VideoDisplayStyles';
import styles from '../styles/WordVideoPageStyle';

const WordVideoPage = ({ route, navigation }) => {
  const { word, videoUrl, description } = route.params;

  return (
    <View style={styles.container}>
        <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={BackIcon} style={styles.backIcon} />
            </TouchableOpacity>
        </View>
        <View style={styles.titleBar}>
            <Text style={styles.pageTitle}>{word}</Text>
        </View>
        <VideoDisplay
            sourceVid={videoUrl}
            customStyle={VideoDisplayStyles.dictionaryVideo}
            customContainerStyle={VideoDisplayStyles.dictionaryContainer}
        />
        {description && (
            <View style={styles.descriptionWrapper}>
                <Text style={styles.descriptionText}>{description}</Text>
            </View>
        )}
    </View>
  );
};

export default WordVideoPage;
