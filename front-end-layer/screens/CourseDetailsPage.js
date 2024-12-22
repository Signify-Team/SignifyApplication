/**
 * @file CourseDetails.js
 * @description Shows the details of a course.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import Lesson from '../components/Lesson';
import RectangularButton from '../components/RectangularButton';
import styles from '../styles/styles';
import { COLORS } from '../utils/constants';

const lessons = [
    { id: 1, type: 'multipleChoice', data: { question: 'What is the sign for Hello?', options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'], correctOption: 'Option 2' } },
    { id: 2, type: 'gesture', data: { prompt: 'Perform the gesture for "Hello".' } },
    { id: 3, type: 'multipleChoice', data: { question: 'What is the sign for Goodbye?', options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'], correctOption: 'Option 4' } },
    { id: 4, type: 'gesture', data: { prompt: 'Perform the gesture for "Goodbye".' } },
];

const CourseDetailPage = () => {
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    const handleAnswer = (answer) => {
        setUserAnswer(answer);
        const correct = lessons[currentLessonIndex].data.correctOption;

        if (answer === correct || answer === 'gestureCaptured') {
            setIsCorrect(true);
            console.log('Correct');
        } else {
            setIsCorrect(false);
            console.log(`Incorrect. The correct answer was: ${correct}`);
        }
    };

    const handleContinue = () => {
        if (currentLessonIndex < lessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
            setUserAnswer(null);
            setIsCorrect(null);
        } else {
            console.log('Course Completed');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Lesson
                    lessonType={lessons[currentLessonIndex].type}
                    questionData={lessons[currentLessonIndex].data}
                    onAnswer={handleAnswer}
                />
                {userAnswer !== null && (
                    <RectangularButton
                        text="Continue"
                        color={isCorrect ? COLORS.tertiary : COLORS.highlight_color_2}
                        onPress={handleContinue}
                    />
                )}
            </ScrollView>
        </View>
    );
};

export default CourseDetailPage;
