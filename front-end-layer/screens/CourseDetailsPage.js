import React, { useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import Lesson from '../components/Lesson';
import RectangularButton from '../components/RectangularButton';
import GestureQuestion from '../components/GestureQuestion';
import MultipleChoiceQuestion from '../components/MultipleChoiceQuestion';
import styles from '../styles/styles';
import { COLORS } from '../utils/constants';

const { width } = Dimensions.get('window');

// Example Lessons Array - fallback if no lessons provided
const defaultLessons = [
    {
        id: 1,
        type: 'multipleChoice',
        data: {
            video: require('../assets/videos/thank_you.mp4'),
            options: ['Hello', 'Thank You', 'Are', 'Yours'],
            correctOption: 'Thank You',
        },
    },
    { id: 2, type: 'gesture', data: { prompt: 'Wave your hand to say Hello.' } },
    {
        id: 3,
        type: 'multipleChoice',
        data: {
            video: require('../assets/videos/thank_you.mp4'),
            options: ['Collect', 'Give', 'Gift', 'Share'],
            correctOption: 'Share',
        },
    },
    { id: 4, type: 'gesture', data: { prompt: 'Perform the gesture for "Goodbye".' } },
];

const CourseDetailPage = ({ route, navigation }) => {
    const { lessons: courseLessons } = route.params || {};
    const lessons = courseLessons?.length > 0 ? courseLessons : defaultLessons;
    
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    const handleAnswer = (answer) => {
        console.log('User Answer:', answer); // Debug userAnswer
        const correct = lessons[currentLessonIndex].data.correctOption;
    
        // Update userAnswer and correctness
        setUserAnswer(answer);
    
        if (answer === correct || answer === 'gestureCaptured') {
            setIsCorrect(true);
            console.log('Correct');
        } else {
            setIsCorrect(false);
            console.log(`Incorrect. The correct answer was: ${correct}`);
        }
    };
    

    const handleGestureSubmission = (result) => {
        if (result.includes('yes')) {
            handleAnswer('gestureCaptured');
        } else {
            handleAnswer(null); // Incorrect gesture
        }
    };

    const handleContinue = () => {
        // Move to the next lesson if available
        if (currentLessonIndex < lessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
            setUserAnswer(null);
            setIsCorrect(null);
        } else {
            console.log('Course Completed');
            navigation.navigate('Home', { screen: 'Courses' });
        }
    };

    const renderLesson = () => {
        const currentLesson = lessons[currentLessonIndex];
    
        if (currentLesson.type === 'multipleChoice') {
            return (
                <MultipleChoiceQuestion
                    data={currentLesson.data}
                    onAnswer={handleAnswer}
                />
            );
        }
    
        if (currentLesson.type === 'gesture') {
            return (
                <GestureQuestion
                    data={currentLesson.data}
                    onSubmit={handleGestureSubmission}
                    onComplete={handleContinue} // Pass handleContinue to proceed after modal
                />
            );
        }
    
        return null;
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.questionsContainer}>
                {renderLesson()}
                {userAnswer !== null && (
                    <RectangularButton
                        text="Continue"
                        width={width * 0.85}
                        color={isCorrect ? COLORS.tertiary : COLORS.highlight_color_2}
                        onPress={handleContinue}
                    />
                )}
            </ScrollView>
        </View>
    );
};

export default CourseDetailPage;
