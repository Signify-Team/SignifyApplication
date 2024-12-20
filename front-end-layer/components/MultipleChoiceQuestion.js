/**
 * @file MultipleChoiceQuestion.js
 * @description Displays a multiple choice question with options.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/QuestionStyles';

const MultipleChoiceQuestion = ({ data, onAnswer }) => {
    return (
        <View style={styles.multContainer}>
            <Text style={styles.question}>{data.question}</Text>
            <View style={styles.optionsContainer}>
                {data.options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.optionButton}
                        onPress={() => onAnswer(option)}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default MultipleChoiceQuestion;

