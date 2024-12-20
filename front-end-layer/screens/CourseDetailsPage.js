/**
 * @file CourseDetails.js
 * @description Shows the details of a course.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Lesson from '../components/Lesson';
import styles from '../styles/styles';

const lessons = [
    { id: 1, type: 'multipleChoice', data: { question: 'What is the sign for Hello?', options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'], correctOption: 'Option 2' } },
    { id: 2, type: 'gesture', data: { prompt: 'Perform the gesture for "Hello".' } },
    { id: 3, type: 'multipleChoice', data: { question: 'What is the sign for Goodbye?', options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'], correctOption: 'Option 4' } },
    { id: 4, type: 'gesture', data: { prompt: 'Perform the gesture for "Goodbye".' } },
];

const CourseDetailPage = () => {
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    const handleAnswer = (answer) => {
        setUserAnswer(answer);
        const correct = lessons[currentLessonIndex].data.correctOption;

        if (answer === correct || answer === 'gestureCaptured') {
            setIsCorrect(true);
            setCorrectAnswer(correct);
        } else {
            setIsCorrect(false);
            setCorrectAnswer(correct);
        }
    };

    const handleContinue = () => {
        if (currentLessonIndex < lessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
            setUserAnswer(null);
            setCorrectAnswer(null);
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
                    <View style={localStyles.resultContainer}>
                        <Text style={localStyles.resultText}>
                            {isCorrect ? 'Correct!' : `Incorrect. The correct answer was: ${correctAnswer}`}
                        </Text>
                        <Text style={localStyles.userAnswerText}>Your Answer: {userAnswer}</Text>
                        <TouchableOpacity style={localStyles.continueButton} onPress={handleContinue}>
                            <Text style={localStyles.continueButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const localStyles = StyleSheet.create({
    resultContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    userAnswerText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 15,
    },
    continueButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CourseDetailPage;
