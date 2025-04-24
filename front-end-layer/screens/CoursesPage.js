/**
 * @file CoursesPage.js
 * @description Shows the courses available for the user.
 *
 * @datecreated 19.12.2024
 * @lastmodified 21.04.2025
 */

import React, { useState, useEffect } from 'react';
import { View, SectionList, ActivityIndicator, RefreshControl, Alert, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../styles/CoursesPageStyles';
import CoursesTopBar from '../components/CoursesTopBar';
import CourseInfoCard from '../components/CourseInfoCard';
import VertCard from '../components/VertCard';
import CoursePath from '../components/CoursePath';
import { COLORS } from '../utils/constants';
import GreetingsIcon from '../assets/icons/course-info/greetings.png';
import {
    fetchSectionsByLanguage,
    getUserLanguagePreference,
    fetchUserCourses,
    updateCourseProgress,
    getUserPremiumStatus,
    fetchCourseExercises,
    updateUserPoints,
    fetchUserProfile,
} from '../utils/apiService';
import StreakPopup from '../components/StreakPopup';

const CoursesPage = ({ navigation, route }) => {
    const [showCard, setShowCard] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [userLanguage, setUserLanguage] = useState(null);
    const [isUserPremium, setIsUserPremium] = useState(false);
    const [showCompletionMessage, setShowCompletionMessage] = useState(false);
    const [userData, setUserData] = useState(null);
    const [showStreakPopup, setShowStreakPopup] = useState(false);
    const [streakMessage, setStreakMessage] = useState('');

    useEffect(() => {
        loadUserLanguageAndSections();
        loadUserPremiumStatus();
        loadUserData();
    }, []);

    useEffect(() => {
        if (userLanguage) {
            setRefreshing(true);
            loadSections(userLanguage);
        }
    }, [userLanguage]);

    useEffect(() => {
        if (route.params?.showCompletionMessage) {
            const { successRate, isPassed } = route.params;
            showCourseCompletionAlert(successRate, isPassed);
            navigation.setParams({ showCompletionMessage: false });
        }
    }, [route.params]);

    useEffect(() => {
        if (route.params?.streakMessage) {
            setStreakMessage(route.params.streakMessage);
            setShowStreakPopup(true);
        }
    }, [route.params]);

    const loadUserPremiumStatus = async () => {
        try {
            const response = await getUserPremiumStatus();
            setIsUserPremium(Boolean(response?.isPremium));
        } catch (error) {
            console.error('Error loading user premium status:', error);
            setIsUserPremium(false);
        }
    };

    const loadUserLanguageAndSections = async () => {
        try {
            const language = await getUserLanguagePreference();
            setUserLanguage(language);
            await loadSections(language);
        } catch (error) {
            console.error('Error loading user language and sections:', error);
        }
    };

    const loadUserData = async () => {
        try {
            const data = await fetchUserProfile();
            setUserData(data);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    // progress logic here (unlocking new courses and sections)
    const loadSections = async (language) => {
        try {
            setLoading(true);
            setRefreshing(true);

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timed out')), 10000);
            });

            const sectionsPromise = fetchSectionsByLanguage(language);
            const userCoursesPromise = fetchUserCourses();

            const [sectionsData, userCoursesData] = await Promise.race([
                Promise.all([sectionsPromise, userCoursesPromise]),
                timeoutPromise
            ]);

            const processedSections = sectionsData.map((section, sectionIndex) => {
                // Check if the previous section's non-premium courses are completed
                const previousSection = sectionsData[sectionIndex - 1];
                const previousSectionCompleted = previousSection ? 
                    previousSection.courses
                        .filter(course => !course.isPremium) // Only check non-premium courses
                        .every(course => 
                            userCoursesData.find(uc => uc.courseId === course.courseId)?.completed
                        ) : true;

                // Check if this section should be unlocked
                // A section is unlocked if:
                // * It's the first section, OR
                // * All non-premium courses in the previous section are completed
                const isSectionUnlocked = sectionIndex === 0 || previousSectionCompleted;

                return {
                    ...section,
                    isLocked: !isSectionUnlocked,
                    courses: section.courses.map((course, courseIndex) => {
                        const userCourse = userCoursesData.find(uc => uc.courseId === course.courseId);
                        
                        // Only unlock if:
                        // * It's the first course in an unlocked section, OR
                        // * The previous course is completed AND the section is unlocked
                        const isFirstCourseInUnlockedSection = isSectionUnlocked && courseIndex === 0;
                        const previousCourse = section.courses[courseIndex - 1];
                        const previousCourseCompleted = previousCourse ? 
                            userCoursesData.find(uc => uc.courseId === previousCourse.courseId)?.completed : false;
                        
                        // all courses are locked unless completed with success rate over 60%
                        let isLocked = true;
                        
                        if (isFirstCourseInUnlockedSection) {
                            // first course of an unlocked section is unlocked
                            isLocked = false;
                        } else if (isSectionUnlocked && previousCourseCompleted) {
                            // course is unlocked if its section is unlocked and previous course is completed
                            isLocked = false;
                        }

                        return {
                            ...course,
                            isLocked,
                            progress: userCourse?.progress || 0,
                            completed: userCourse?.completed || false
                        };
                    })
                };
            });

            setSections(processedSections);
        } catch (error) {
            console.error('Error loading sections:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleButtonPress = (course) => {
        // Don't show card for locked courses
        if (course.isLocked) {
            return;
        }

        if (selectedCourse?._id === course._id) {
            setShowCard(!showCard);
        } else {
            setSelectedCourse(course);
            setShowCard(true);
        }
    };

    const handleNavigateToCourse = async () => {
        try {
            console.log('Selected course:', selectedCourse); // Debug log
            if (!selectedCourse || !selectedCourse._id) {
                console.error('Invalid course data:', selectedCourse);
                return;
            }

            const [exercises, progressUpdate] = await Promise.all([
                fetchCourseExercises(selectedCourse._id),
                updateCourseProgress(selectedCourse._id, selectedCourse.progress || 0),
            ]);

            navigation.navigate('CourseDetails', {
                title: selectedCourse.name,
                description: selectedCourse.description,
                courseId: selectedCourse._id,
                exercises: exercises || [],
            });
        } catch (error) {
            console.error('Error preparing course:', error);
            // Still navigate but with empty exercises array
            navigation.navigate('CourseDetails', {
                title: selectedCourse.name,
                description: selectedCourse.description,
                courseId: selectedCourse._id,
                exercises: [],
            });
        }
    };

    const handleLanguageChange = (newLanguage) => {
        setUserLanguage(newLanguage);
    };

    const onRefresh = () => {
        setRefreshing(true);
        setRefreshTrigger(prev => prev + 1);
        loadUserLanguageAndSections();
        loadUserPremiumStatus();
    };

    const showCourseCompletionAlert = async (successRate, isPassed) => {
        let message;
        if (isPassed) {
            try {
                const updatedPoints = await updateUserPoints(50, 'Course completion');
                message = `Congratulations! You completed the course with ${successRate.toFixed(1)}% success rate. You earned 50 points! Your total points are now ${updatedPoints}. The next course is now unlocked!`;
            } catch (error) {
                console.error('Error updating points:', error);
                message = `Congratulations! You completed the course with ${successRate.toFixed(1)}% success rate. The next course is now unlocked!`;
            }
        } else {
            message = `You completed the course with ${successRate.toFixed(1)}% success rate. Please try again to unlock the next course.`;
        }

        Alert.alert(
            isPassed ? 'Course Completed!' : 'Course Completed',
            message,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        setShowCompletionMessage(false);
                        // Force a complete refresh of the course list
                        setRefreshing(true);
                        loadUserLanguageAndSections();
                    }
                }
            ]
        );
    };

    const handleStreakPopupClose = () => {
        setShowStreakPopup(false);
    };

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CoursesTopBar
                refreshTrigger={refreshTrigger}
                navigation={navigation}
                onLanguageChange={handleLanguageChange}
            />
            <View style={[styles.container, styles.contentContainer]}>
                <SectionList
                    sections={sections.map(section => ({
                        ...section,
                        data: [section],
                    }))}
                    renderItem={({ item }) => (
                        <CoursePath
                            courses={item.courses}
                            onCoursePress={handleButtonPress}
                            isUserPremium={isUserPremium}
                        />
                    )}
                    renderSectionHeader={({ section }) => (
                        <View style={styles.sectionHeader}>
                            <CourseInfoCard
                                icon={GreetingsIcon}
                                title={section.name}
                                isLocked={section.isLocked}
                            />
                        </View>
                    )}
                    stickySectionHeadersEnabled={true}
                    keyExtractor={item => item._id}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[COLORS.primary]}
                            tintColor={COLORS.primary}
                        />
                    }
                />
                {showCard && selectedCourse && (
                    <VertCard
                        title={selectedCourse.name}
                        description={selectedCourse.description}
                        level={selectedCourse.level}
                        buttonText="START"
                        onPress={handleNavigateToCourse}
                        onDictionaryPress={() => navigation.navigate('Dictionary', { courseId: selectedCourse._id })}
                    />
                )}
            </View>

            <StreakPopup
                visible={showStreakPopup}
                message={streakMessage}
                onClose={handleStreakPopupClose}
            />
        </View>
    );
};

export default CoursesPage;

