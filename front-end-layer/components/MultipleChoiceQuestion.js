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

    const correctAnswer = data.correctOption;

    const handlePress = (answer) => {
        setSelectedAnswer(answer);
        setIsAnswered(true);
        onAnswer(answer);
    };

    return (
        <>
            <VideoDisplay
                sourceVid={data.video}
            />
            <View style={styles.multContainer}>
                <View style={styles.optionsContainer}>
                    {data.options.map((option, index) => (
                        <AnswerCard
                            key={index}
                            answer={option}
                            isSelected={selectedAnswer === option}
                            isCorrect={option === correctAnswer}
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
