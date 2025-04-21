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
    StyleSheet,
    Dimensions,
} from 'react-native';
import { COLORS, FONTS } from '../utils/constants';
import BackIcon from '../assets/icons/header/back.png';

const { width, height } = Dimensions.get('window');

const sampleWords = [
  {
    _id: '67d323ed54ef1ceb8a0ce517',
    wordId: 1,
    name: 'share',
    category: 'everyday_signs',
    videoUrl: 'https://signifyappbucket.s3.eu-north-1.amazonaws.com/ASL_DATA/Everyday_Signs/share/share_1.mp4',
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: height * 0.07,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: width * 0.04,
        paddingBottom: height * 0.015,
    },
    backIcon: {
        width: width * 0.08,
        height: width * 0.08,
        tintColor: COLORS.neutral_base_dark,
    },
    pageTitle: {
        fontSize: width * 0.065,
        fontFamily: FONTS.poppins_font,
        color: COLORS.neutral_base_dark,
        marginLeft: width * 0.03,
        fontWeight: 'bold',
    },
    wordList: {
        paddingHorizontal: width * 0.04,
        paddingTop: height * 0.015,
    },
    wordCard: {
        backgroundColor: COLORS.soft_pink_background,
        borderRadius: 12,
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.04,
        marginBottom: height * 0.015,
        elevation: 2,
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    wordText: {
        fontSize: width * 0.045,
        fontFamily: FONTS.poppins_font,
        color: COLORS.neutral_base_dark,
    },
});

export default DictionaryPage;
