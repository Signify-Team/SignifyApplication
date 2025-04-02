/**
 * @file MultipleChoiceQuestion.js
 * @description Displays a multiple choice question with options.
 *
 * @datecreated 19.12.2024
 * @lastmodified 20.12.2024
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import AnswerCard from './AnswerCard';
import styles from '../styles/QuestionStyles';
import VideoDisplay from './VideoDisplay';

const MultipleChoiceQuestion = ({ data, onAnswer }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    if (!data || !Array.isArray(data.options)) {
        console.warn('Invalid data structure in MultipleChoiceQuestion:', data);
        return null;
    }

    const handlePress = (answer) => {
        if (isAnswered) return;
        setSelectedAnswer(answer);
        setIsAnswered(true);
        onAnswer(answer);
    };

    return (
        <>
            {data.video && (
                <VideoDisplay
                    sourceVid={data.video}
                />
            )}
            <View style={styles.multContainer}>
                <View style={styles.optionsContainer}>
                    {data.options.map((option, index) => (
                        <AnswerCard
                            key={index}
                            answer={option}
                            isSelected={selectedAnswer === option}
                            isCorrect={option === data.correctOption}
                            onPress={() => handlePress(option)}
                            isAnswered={isAnswered}
                        />
                    ))}
                </View>
            </View>
        </>
    );
};

export default MultipleChoiceQuestion;
