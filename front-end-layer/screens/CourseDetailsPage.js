/**
 * @file CourseDetails.js
 * @description Shows the details of a course.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import Lesson from '../components/Question';
import styles from '../styles/styles';

const lessons = [
    { id: 1, type: 'multipleChoice', data: { question: 'What is the sign for Hello?', options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'] } },
    { id: 2, type: 'gesture', data: { prompt: 'Perform the gesture for "Hello".' } },
];

const CourseDetailPage = () => {
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

    const handleAnswer = (answer) => {
        console.log('User Answer:', answer);
        if (currentLessonIndex < lessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
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
            </ScrollView>
        </View>
    );
};

export default CourseDetailPage;
