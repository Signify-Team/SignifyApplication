/**
 * @file DictionaryPage.js
 * @description Displays dictionary words for the user to explore and practice.
 *
 * @datecreated 21.04.2025
 * @lastmodified 21.04.2025
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS } from '../utils/constants';
import BackIcon from '../assets/icons/header/back.png';
import KoalaHand from '../assets/icons/header/koala-hand.png';
import { fetchCourseDictionary, fetchAllUnlockedCourseWords } from '../utils/services/wordService';

const { width, height } = Dimensions.get('window');

const DictionaryPage = ({ navigation, route }) => {
  const [words, setWords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWords, setFilteredWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setLoading(true);
        let fetchedWords;
        if (route.params?.courseId) {
          fetchedWords = await fetchCourseDictionary(route.params.courseId);
        } else {
          fetchedWords = await fetchAllUnlockedCourseWords();
        }
        setWords(fetchedWords);
        setFilteredWords(fetchedWords);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadDictionary();
  }, [route.params?.courseId]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredWords(words);
    } else {
      const filtered = words.filter(word => 
        word.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWords(filtered);
    }
  }, [searchQuery, words]);

  const handleWordPress = (wordObj) => {
    if (wordObj.videoUrl) {
      navigation.navigate('WordVideo', {
        word: wordObj.name,
        videoUrl: wordObj.videoUrl,
        description: wordObj.description,
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <View style={styles.loadingContainer}>
          <Image source={KoalaHand} style={styles.loadingKoalaHand} />
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />
          <Text style={styles.loadingText}>Loading dictionary...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={BackIcon} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.pageTitle}>Dictionary</Text>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search words..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor={COLORS.neutral_base_dark}
                />
            </View>

            <FlatList
              contentContainerStyle={styles.wordList}
              data={filteredWords}
              keyExtractor={(item) => `${item._id}-${item.courseId || 'global'}`}
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
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingKoalaHand: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    loadingIndicator: {
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 18,
        fontFamily: FONTS.poppins_font,
        color: COLORS.primary,
        textAlign: 'center',
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        fontFamily: FONTS.poppins_font,
        color: COLORS.error,
        textAlign: 'center',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    wordText: {
        fontSize: width * 0.045,
        fontFamily: FONTS.poppins_font,
        color: COLORS.neutral_base_dark,
    },
    searchContainer: {
        paddingHorizontal: width * 0.04,
        marginBottom: height * 0.015,
    },
    searchInput: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
        fontSize: width * 0.04,
        fontFamily: FONTS.poppins_font,
        color: COLORS.neutral_base_dark,
        elevation: 2,
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});

export default DictionaryPage;
