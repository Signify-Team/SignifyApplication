/**
 * @file MultipleChoiceQuestion.js
 * @description Displays a multiple choice question with options.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

// MultipleChoiceQuestion.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AnswerCard from './AnswerCard';

const MultipleChoiceQuestion = ({ data, onAnswer }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const correctAnswer = data.correctOption; // Assuming this is provided in `data`

    const handlePress = (answer) => {
        setSelectedAnswer(answer);
        setIsAnswered(true);
        onAnswer(answer);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.question}>{data.question}</Text>
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
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    question: {
        fontSize: 22,
        marginBottom: 20,
        textAlign: 'center',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
});

export default MultipleChoiceQuestion;


