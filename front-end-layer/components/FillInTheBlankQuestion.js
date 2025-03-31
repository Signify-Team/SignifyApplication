import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Video from 'react-native-video';
import { COLORS, FONTS } from '../utils/constants';
import sharedStyles from '../styles/QuestionStyles';

const { width, height } = Dimensions.get('window');

const FillInTheBlankQuestion = ({ data, onAnswer }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const videoRefs = useRef(data.options.map(() => null));

    useEffect(() => {
        videoRefs.current.forEach(ref => {
            if (ref) {
                ref.seek(0);
            }
        });
    }, []);

    const handleOptionPress = (index) => {
        if (isAnswered) return; // Prevent changing answer if already answered
        setSelectedOption(index);
        setIsAnswered(true);
        onAnswer(index);
    };

    return (
        <View style={sharedStyles.quesContainer}>
            <View style={styles.contentContainer}>
                <View style={styles.questionContainer}>
                    <Text style={[sharedStyles.question, styles.questionText]}>
                        {data.sentence}
                    </Text>
                </View>
                <View style={[sharedStyles.optionsContainer, styles.optionsContainer]}>
                    {data.options.map((videoUrl, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.optionContainer,
                                selectedOption === index && styles.selectedOption
                            ]}
                            onPress={() => handleOptionPress(index)}
                            disabled={isAnswered}
                        >
                            <View style={[
                                styles.videoWrapper,
                                selectedOption === index && isAnswered && styles.selectedVideoWrapper
                            ]}>
                                <Video
                                    ref={ref => videoRefs.current[index] = ref}
                                    source={{ uri: videoUrl }}
                                    style={styles.video}
                                    controls={false}
                                    resizeMode="cover"
                                    repeat={true}
                                    paused={false}
                                    muted={true}
                                />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: height * 0.1,
    },
    questionContainer: {
        backgroundColor: COLORS.background_secondary,
        padding: width * 0.05,
        borderRadius: 15,
        marginBottom: height * 0.05,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    questionText: {
        marginBottom: 0,
    },
    optionsContainer: {
        marginTop: height * 0.02,
    },
    optionContainer: {
        width: width * 0.4,
        aspectRatio: 1,
        margin: width * 0.02,
    },
    videoWrapper: {
        flex: 1,
        backgroundColor: COLORS.background_secondary,
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    selectedOption: {
        transform: [{ scale: 1.05 }],
    },
    selectedVideoWrapper: {
        borderColor: COLORS.tertiary,
        borderWidth: 3,
    },
    video: {
        width: '100%',
        height: '100%',
    },
});

export default FillInTheBlankQuestion; 