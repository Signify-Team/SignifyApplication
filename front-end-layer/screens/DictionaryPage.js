/**
 * @file DictionaryPage.js
 * @description Displays dictionary words for the user to explore and practice.
 *
 * @datecreated 21.04.2025
 * @lastmodified 21.04.2025
 */

import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';

import BackIcon from '../assets/icons/header/back.png';
import styles from '../styles/DictionaryPageStyle';

const sampleWords = [
  {
    _id: '67d323ed54ef1ceb8a0ce517',
    wordId: 1,
    name: 'share',
    category: 'everyday_signs',
    description: 'This is the ASL sign for "share" verb. Used in contexts like "sharing something with someone/something..."',
  },
];


const DictionaryPage = ({ navigation }) => {
  const handleWordPress = (wordObj) => {
    navigation.navigate('WordVideo', {
      word: wordObj.name,
      videoUrl: wordObj.videoUrl,
      description: wordObj.description, // Optional: if you want to show it on the video screen
    });
  };


    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={BackIcon} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.pageTitle}>Dictionary</Text>
            </View>

            <FlatList
              contentContainerStyle={styles.wordList}
              data={sampleWords}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.wordCard}
                  onPress={() => handleWordPress(item)}
                >
                  <Text style={styles.wordText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />

        </View>
    );
};

export default DictionaryPage;
