/**
 * @file Lesson.js
 * @description Handles rendering of different question types.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React from 'react';
import { View } from 'react-native';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import GestureQuestion from './GestureQuestion';
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
        </View>
    );
};

export default Lesson;
