/**
 * @file MatchingQuestion.js
 * @description Displays a matching exercise where users match sign language videos with text options.
 *
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';
import { COLORS, FONTS } from '../utils/constants';
import styles from '../styles/QuestionStyles';

const { width, height } = Dimensions.get('window');

const MatchingQuestion = ({ data, onAnswer }) => {
    const [selectedText, setSelectedText] = useState(null);
    const [matches, setMatches] = useState({});
    const [isComplete, setIsComplete] = useState(false);
    const [randomizedWords, setRandomizedWords] = useState([]);

    // Make sure that the data has a correct structure
    if (!data || !Array.isArray(data.pairs)) {
        console.warn('Invalid data structure in MatchingQuestion:', data);
        return null;
    }

    useEffect(() => {
        try {
            // Randomly order the words
            const validPairs = data.pairs.filter(pair => pair && typeof pair === 'object' && pair.word);
            const shuffledWords = [...validPairs].sort(() => Math.random() - 0.5);
            setRandomizedWords(shuffledWords);
        } catch (error) {
            console.error('Error setting up randomized words:', error);
            setRandomizedWords([]);
        }
    }, [data.pairs]);

    useEffect(() => {
        try {
            if (Object.keys(matches).length === data.pairs.length) {
                setIsComplete(true);
                const isCorrect = checkAllMatches();
                onAnswer(isCorrect);
            }
        } catch (error) {
            console.error('Error checking matches:', error);
        }
    }, [matches]);

    const checkAllMatches = () => {
        try {
            return data.pairs.every((pair, index) => {
                return pair && pair.word && matches[index] === pair.word;
            });
        } catch (error) {
            console.error('Error in checkAllMatches:', error);
            return false;
        }
    };

    const handleTextSelection = (text) => {
        if (!text) return;
        setSelectedText(selectedText === text ? null : text);
    };

    const handleVideoSelection = (index) => {
        if (selectedText && !matches[index]) {
            setMatches(prev => ({
                ...prev,
                [index]: selectedText
            }));
            setSelectedText(null);
        }
    };

    const isTextSelected = (text) => text && selectedText === text;
    const isTextMatched = (text) => text && Object.values(matches).includes(text);
    const getVideoMatch = (index) => matches[index] || null;

    // Check the word video pairs
    const validPairs = data.pairs.filter(pair => 
        pair && typeof pair === 'object' && pair.word && pair.signVideoUrl
    );

    if (validPairs.length === 0) {
        console.warn('No valid pairs found in MatchingQuestion');
        return null;
    }

    return (
        <View style={styles.quesContainer}>
            <View style={localStyles.contentContainer}>
                <Text style={localStyles.instructionText}>
                    Match the words with the corresponding signing videos
                </Text>

                {/* Text Options */}
                <View style={localStyles.textOptionsContainer}>
                    {randomizedWords.map((pair, index) => (
                        pair && pair.word ? (
                            <TouchableOpacity
                                key={`text-${index}`}
                                style={[
                                    localStyles.textOption,
                                    isTextSelected(pair.word) && localStyles.selectedText,
                                    isTextMatched(pair.word) && localStyles.matchedText
                                ]}
                                onPress={() => handleTextSelection(pair.word)}
                                disabled={isTextMatched(pair.word)}
                            >
                                <Text style={localStyles.textOptionText}>{pair.word}</Text>
                            </TouchableOpacity>
                        ) : null
                    ))}
                </View>

                {/* Video Options */}
                <View style={localStyles.videoContainer}>
                    {validPairs.map((pair, index) => (
                        <TouchableOpacity
                            key={`video-${index}`}
                            style={[
                                localStyles.videoWrapper,
                                getVideoMatch(index) && localStyles.matchedVideo
                            ]}
                            onPress={() => handleVideoSelection(index)}
                            disabled={!!getVideoMatch(index)}
                        >
                            <Video
                                source={pair.signVideoUrl}
                                style={localStyles.video}
                                resizeMode="cover"
                                repeat={true}
                                muted={true}
                                onError={(error) => console.warn('Video error:', error, pair.signVideoUrl)}
                            />
                            {getVideoMatch(index) && (
                                <View style={localStyles.matchOverlay}>
                                    <Text style={localStyles.matchText}>{getVideoMatch(index)}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

const localStyles = StyleSheet.create({
    contentContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    instructionText: {
        fontSize: 20,
        fontFamily: FONTS.poppins_font,
        color: COLORS.neutral_base_dark,
        textAlign: 'center',
        marginBottom: height * 0.03,
        paddingHorizontal: width * 0.05,
    },
    textOptionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: width * 0.03,
        marginBottom: height * 0.03,
    },
    textOption: {
        backgroundColor: COLORS.soft_pink_background,
        padding: width * 0.03,
        borderRadius: 12,
        minWidth: width * 0.4,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.border,
    },
    selectedText: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.tertiary,
    },
    matchedText: {
        opacity: 0.5,
    },
    textOptionText: {
        fontSize: 16,
        fontFamily: FONTS.poppins_font,
        color: COLORS.neutral_base_dark,
    },
    videoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: width * 0.03,
    },
    videoWrapper: {
        width: width * 0.4,
        height: width * 0.4,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: COLORS.border,
    },
    matchedVideo: {
        borderColor: COLORS.tertiary,
        borderWidth: 3,
    },
    video: {
        width: '100%',
        height: '100%',
    },
    matchOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    matchText: {
        color: COLORS.light_gray_1,
        fontSize: 16,
        fontFamily: FONTS.poppins_font,
    },
});

export default MatchingQuestion; 