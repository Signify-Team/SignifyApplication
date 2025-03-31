/**
 * @file TrueFalseQuestion.js
 * @description Displays a true/false question with two answer options.
 *
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import RectangularButton from './RectangularButton';
import { COLORS } from '../utils/constants';
import styles from '../styles/QuestionStyles';

const TrueFalseQuestion = ({ data, onAnswer }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const handlePress = (answer) => {
        if (isAnswered) return;
        setSelectedAnswer(answer);
        setIsAnswered(true);
        onAnswer(answer);
    };

    const getButtonColor = (value) => {
        if (!isAnswered) return COLORS.soft_pink_background;
        if (selectedAnswer === value) {
            return value === data.correctAnswer ? COLORS.tertiary : COLORS.highlight_color_2;
        }
        if (value === data.correctAnswer) return COLORS.tertiary;
        return COLORS.soft_pink_background;
    };

    return (
        <View style={styles.quesContainer}>
            <View style={styles.trueFalseContainer}>
                <Text style={styles.question}>{data.statement}</Text>
                <View style={styles.optionsContainer}>
                    <RectangularButton
                        width={150}
                        text="True"
                        color={getButtonColor(true)}
                        onPress={() => handlePress(true)}
                        disabled={isAnswered}
                    />
                    <RectangularButton
                        width={150}
                        text="False"
                        color={getButtonColor(false)}
                        onPress={() => handlePress(false)}
                        disabled={isAnswered}
                    />
                </View>
            </View>
        </View>
    );
};

export default TrueFalseQuestion; 