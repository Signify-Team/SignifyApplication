/**
 * @file CourseCompletionPopup.js
 * @description A custom popup to display course completion results
 *
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/CourseCompletionPopupStyle';
import { COLORS } from '../utils/constants';
import SuccessIcon from '../assets/icons/course-info/successIcon.png';
import FailIcon from '../assets/icons/course-info/failedCourseIcon.png';
import LivesLostIcon from '../assets/icons/course-info/failedCourseIcon.png'; // Reusing failed course icon for now

const CourseCompletionPopup = ({
    visible,
    onClose,
    isPracticeMode,
    isPassed,
    successRate,
    userPoints,
    pointsEarned = 50,
    outOfLives = false,
    remainingLives = 0,
}) => {
    // Determine title based on mode and success
    const getTitle = () => {
        if (outOfLives) {
            return 'Out of Lives!';
        } else if (isPracticeMode) {
            return isPassed ? 'Practice Complete' : 'Practice Complete';
        } else {
            return isPassed ? 'Course Completed!' : 'Course Completed';
        }
    };

    // Determine message based on mode and success
    const getMessage = () => {
        if (outOfLives) {
            return `You've used all your lives. You completed ${successRate.toFixed(1)}% of the course. Try again to improve your score and finish the course.`;
        } else if (isPracticeMode) {
            return isPassed 
                ? `Great job practicing! You've passed the practice session with a ${successRate.toFixed(1)}% success rate.`
                : `Practice session completed with a ${successRate.toFixed(1)}% success rate. Keep practicing to improve your skills.`;
        } else {
            return isPassed
                ? `Congratulations! You completed the course with a ${successRate.toFixed(1)}% success rate and ${remainingLives} ${remainingLives === 1 ? 'life' : 'lives'} remaining.\n\nYou earned ${pointsEarned} points! Your total points are now ${userPoints}.`
                : `You completed the course with a ${successRate.toFixed(1)}% success rate. Please try again to improve your score and unlock the next course.`;
        }
    };

    // Get the appropriate icon
    const getIcon = () => {
        if (outOfLives) {
            return LivesLostIcon;
        } else {
            return isPassed ? SuccessIcon : FailIcon;
        }
    };

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.iconContainer}>
                        <Image 
                            source={getIcon()} 
                            style={styles.icon}
                        />
                    </View>
                    <Text style={styles.title}>{getTitle()}</Text>
                    <Text style={styles.message}>{getMessage()}</Text>
                    <TouchableOpacity
                        style={[styles.button, { 
                            backgroundColor: outOfLives ? COLORS.highlight_color_2 : 
                                           (isPassed ? COLORS.secondary : COLORS.primary) 
                        }]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CourseCompletionPopup; 