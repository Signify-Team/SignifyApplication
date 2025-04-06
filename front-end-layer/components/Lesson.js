/**
 * @file Lesson.js
 * @description Handles rendering of different question types.
 *
 * @datecreated 19.12.2024
 * @lastmodified 31.03.2025
 */

import React from 'react';
import { View } from 'react-native';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import GestureQuestion from './GestureQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import MatchingQuestion from './MatchingQuestion';
import styles from '../styles/QuestionStyles';

const Lesson = ({ lessonType, questionData, onAnswer }) => {
    return (
        <View style={styles.quesContainer}>
            {lessonType === 'multipleChoice' && (
                <MultipleChoiceQuestion data={questionData} onAnswer={onAnswer} />
            )}
            {lessonType === 'gesture' && (
                <GestureQuestion data={questionData} onAnswer={onAnswer} />
            )}
            {lessonType === 'trueFalse' && (
                <TrueFalseQuestion data={questionData} onAnswer={onAnswer} />
            )}
            {lessonType === 'matching' && (
                <MatchingQuestion data={questionData} onAnswer={onAnswer} />
            )}
        </View>
    );
};

export default Lesson;
