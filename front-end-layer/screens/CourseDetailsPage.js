import React, { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, Alert, StatusBar } from 'react-native';
import RectangularButton from '../components/RectangularButton';
import GestureQuestion from '../components/GestureQuestion';
import MultipleChoiceQuestion from '../components/MultipleChoiceQuestion';
import TrueFalseQuestion from '../components/TrueFalseQuestion';
import FillInTheBlankQuestion from '../components/FillInTheBlankQuestion';
import ProgressTopBar from '../components/ProgressTopBar';
import ConfirmationModal from '../components/ConfirmationModal';
import styles from '../styles/styles';
import { COLORS } from '../utils/constants';
import MatchingQuestion from '../components/MatchingQuestion';
import { updateCourseProgress, updateCourseCompletion } from '../utils/services/courseService';
import { playPrimaryButtonSound } from '../utils/services/soundServices';

const { width } = Dimensions.get('window');

const CourseDetailPage = ({ route, navigation }) => {
    const courseExercises = route?.params?.exercises || [];
    const isPracticeMode = route?.params?.isPracticeMode || false;
    const transformExercises = (exercises) => {

        if (!exercises || !Array.isArray(exercises)) {
            return defaultLessons;
        }
        return exercises.map(exercise => {
            if (!exercise || typeof exercise !== 'object') {
                return null;
            }

            const exerciseType = String(exercise?.type || '').trim();

            const baseExercise = {
                id: String(exercise?.id || exercise?._id || ''),
                type: exerciseType.toLowerCase(),
                data: {},
            };

            try {
                switch (exerciseType) {
                    case 'TrueFalse':
                        return {
                            ...baseExercise,
                            type: 'trueFalse',
                            data: {
                                statement: String(exercise?.statement || ''),
                                correctAnswer: Boolean(exercise?.correctAnswer),
                            },
                        };
                    case 'Multichoice':
                        return {
                            ...baseExercise,
                            type: 'multichoice',
                            data: {
                                video: exercise?.signVideoUrl || null,
                                word: String(exercise?.word || ''),
                                options: Array.isArray(exercise?.options) ? exercise.options.map(opt => String(opt || '')) : [],
                                correctOption: String(exercise?.correctAnswer || ''),
                            }
                        };
                    case 'FillInTheBlank':
                        return {
                            ...baseExercise,
                            type: 'fillInTheBlank',
                            data: {
                                sentence: String(exercise?.sentence || ''),
                                options: Array.isArray(exercise?.options) ? exercise.options.map(opt => String(opt || '')) : [],
                                correctAnswerIndex: Number(exercise?.correctAnswerIndex) || 0,
                            }
                        };
                    case 'Matching':
                        const pairs = Array.isArray(exercise?.pairs) ? exercise.pairs : [];
                        return {
                            ...baseExercise,
                            type: 'matching',
                            data: {
                                pairs: pairs.map(pair => ({
                                    signVideoUrl: String(pair?.signVideoUrl || ''),
                                    word: String(pair?.word || ''),
                                })),
                            },
                        };
                    case 'Signing':
                        return {
                            ...baseExercise,
                            type: 'gesture',
                            data: {
                                word: String(exercise?.word || ''),
                            },
                        };
                    default:
                        console.warn('Unknown exercise type:', exerciseType);
                        return null;
                }
            } catch (error) {
                console.error('Error transforming exercise:', error, exercise);
                return null;
            }
        }).filter(Boolean); // Remove null exercises
    };

    const exercises = transformExercises(courseExercises);
    console.log('Transformed exercises:', exercises);

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [completedExercises, setCompletedExercises] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [lives, setLives] = useState(5); // Initialize with 1 life
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    
    // Calculate progress percentage
    const progressPercentage = exercises.length > 0
        ? ((currentExerciseIndex) / exercises.length) * 100
        : 0;

    const handleAnswer = (answer) => {
        if (answer === undefined || answer === null) {
            console.warn('Invalid answer received');
            return;
        }

        const currentExercise = exercises[currentExerciseIndex];

        if (!currentExercise?.data) {
            console.warn('Invalid exercise data in handleAnswer');
            return;
        }

        let correct = false;

        try {
            // Reset previous state!!
            setUserAnswer(null);
            setIsCorrect(null);

            switch (currentExercise.type) {
                case 'multichoice':
                    correct = String(answer) === String(currentExercise.data.correctOption);
                    break;
                case 'trueFalse':
                    correct = Boolean(answer) === Boolean(currentExercise.data.correctAnswer);
                    break;
                case 'fillInTheBlank':
                    correct = Number(answer) === Number(currentExercise.data.correctAnswerIndex);
                    break;
                case 'matching':
                    if (!answer.data || !Array.isArray(answer.data.pairs) || !Array.isArray(currentExercise.data.pairs)) {
                        console.warn('Invalid matching answer format');
                        correct = false;
                        break;
                    }
                    correct = answer.data.pairs.every((pair, index) =>
                        currentExercise.data.pairs[index] &&
                        String(pair?.matchedWord || '') === String(currentExercise.data.pairs[index]?.word || '')
                    );
                    break;
                case 'gesture':
                    correct = Boolean(answer);
                    break;
                default:
                    console.warn('Unknown exercise type in handleAnswer:', currentExercise.type);
            }

            // increment correct answers count by 1 if correct
            if (correct) {
                setCorrectAnswers(prev => prev + 1);
            } else {
                // Decrement lives when answer is incorrect
                setLives(prev => {
                    const newLives = prev - 1;
                    return newLives;
                });
            }

            // Set new state
            setUserAnswer(answer);
            setIsCorrect(correct);
        } catch (error) {
            console.error('Error in handleAnswer:', error);
            setUserAnswer(null);
            setIsCorrect(false);
        }
    };

    const handleContinue = async () => {
        // Play sound effect
        playPrimaryButtonSound();
        
        // Check if lives are depleted
        if (lives <= 0) {
            try {
                if (!isPracticeMode) {
                    // Calculate progress percentage based on completed exercises
                    const progress = (currentExerciseIndex + 1) / exercises.length * 100;
                    await updateCourseProgress(route.params.courseId, progress, false);
                }

                // Reset states before navigation
                setUserAnswer(null);
                setIsCorrect(null);

                // Use a small timeout to ensure state updates are complete
                setTimeout(() => {
                    // Navigate to Courses tab with out of lives message
                    navigation.navigate('Home', {
                        screen: 'Courses',
                        params: {
                            showCompletionMessage: true,
                            isPassed: false,
                            isPracticeMode: isPracticeMode,
                            outOfLives: true,
                        },
                    });
                }, 100);
                return;
            } catch (error) {
                console.error('Error updating course progress:', error);
                navigation.navigate('Home', { screen: 'Courses' });
                return;
            }
        }

        // add to completed exercises list
        setCompletedExercises(prev => [...prev, currentExerciseIndex]);

        if (currentExerciseIndex < exercises.length - 1) {
            // Reset all states
            setUserAnswer(null);
            setIsCorrect(null);
            setCurrentExerciseIndex(prevIndex => prevIndex + 1);
        } else {
            // course complete
            const successRate = (correctAnswers / exercises.length) * 100;
            const isCoursePassed = successRate >= 60;

            try {
                if (!isPracticeMode) {
                    // Only update course completion for regular mode
                    const response = await updateCourseCompletion(route.params.courseId, isCoursePassed);

                    // Navigate to Courses tab with completion message and streak info
                    navigation.navigate('Home', {
                        screen: 'Courses',
                        params: {
                            showCompletionMessage: true,
                            successRate,
                            isPassed: isCoursePassed,
                            isPracticeMode: isPracticeMode,
                            remainingLives: lives,
                            streakMessage: response.streakMessage,
                            shouldShowNotification: response.shouldShowNotification
                        }
                    });
                } else {
                    // For practice mode, don't include streak info
                    navigation.navigate('Home', {
                        screen: 'Courses',
                        params: {
                            showCompletionMessage: true,
                            successRate,
                            isPassed: isCoursePassed,
                            isPracticeMode: isPracticeMode,
                            remainingLives: lives
                        }
                    });
                }
            } catch (error) {
                console.error('Error updating course progress:', error);
                navigation.navigate('Home', { screen: 'Courses' });
            }
        }
    };

    // Reset states when exercise changes
    useEffect(() => {
        setUserAnswer(null);
        setIsCorrect(null);
    }, [currentExerciseIndex]);

    const renderExercise = () => {
        const currentExercise = exercises[currentExerciseIndex];
        if (!currentExercise?.data) {
            console.warn('No valid exercise to render');
            return null;
        }

        try {
            switch (currentExercise.type) {
                case 'multichoice':
                    return (
                        <MultipleChoiceQuestion
                            key={`${currentExercise.id}-${currentExerciseIndex}`}
                            data={currentExercise.data}
                            onAnswer={handleAnswer}
                        />
                    );
                case 'gesture':
                    return (
                        <GestureQuestion
                            key={`${currentExercise.id}-${currentExerciseIndex}`}
                            data={currentExercise.data}
                            onSubmit={handleAnswer}
                            onComplete={handleContinue}
                            lives={lives}
                            navigation={navigation}
                        />
                    );
                case 'trueFalse':
                    return (
                        <TrueFalseQuestion
                            key={`${currentExercise.id}-${currentExerciseIndex}`}
                            data={currentExercise.data}
                            onAnswer={handleAnswer}
                        />
                    );
                case 'fillInTheBlank':
                    return (
                        <FillInTheBlankQuestion
                            key={`${currentExercise.id}-${currentExerciseIndex}`}
                            data={currentExercise.data}
                            onAnswer={handleAnswer}
                        />
                    );
                case 'matching':
                    return (
                        <MatchingQuestion
                            key={`${currentExercise.id}-${currentExerciseIndex}`}
                            data={currentExercise}
                            onAnswer={handleAnswer}
                        />
                    );
                default:
                    console.warn('Unsupported exercise type:', currentExercise.type);
                    return null;
            }
        } catch (error) {
            console.error('Error rendering exercise:', error);
            return null;
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
            <View style={[styles.container, { paddingTop: 0, paddingBottom: 0, marginTop: 0 }]}>
                <ProgressTopBar 
                    navigation={navigation}
                    currentProgress={progressPercentage}
                    lives={lives}
                    onBackPress={() => {
                        if (exercises.length > 0) {
                            setShowLeaveModal(true);
                        } else {
                            navigation.goBack();
                        }
                    }}
                />
                <View style={{
                    flex: 1,
                    paddingTop: 20,
                    paddingBottom: 0,
                }}>
                    <ScrollView
                        contentContainerStyle={[
                            styles.questionsContainer,
                            { paddingBottom: userAnswer !== null ? 60 : 0 }
                        ]}
                    >
                        {renderExercise()}
                    </ScrollView>
                    {userAnswer !== null && exercises[currentExerciseIndex]?.type !== 'gesture' && (
                        <View style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            alignItems: 'center',
                            paddingBottom: 40,
                            marginBottom: 0,
                        }}>
                            <RectangularButton
                                text="Continue"
                                width={width * 0.85}
                                color={isCorrect ? COLORS.tertiary : COLORS.highlight_color_2}
                                onPress={handleContinue}
                                style={{ marginBottom: 0 }}
                            />
                        </View>
                    )}
                </View>
            </View>
            <ConfirmationModal
                visible={showLeaveModal}
                title="Leave Course?"
                message="Your progress will not be saved if you leave now."
                onConfirm={() => {
                    setShowLeaveModal(false);
                    navigation.goBack();
                }}
                onCancel={() => setShowLeaveModal(false)}
            />
        </View>
    );
};

export default CourseDetailPage;
