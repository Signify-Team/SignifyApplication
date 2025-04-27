/**
 * @file CoursesPage.js
 * @description Shows the courses available for the user.
 *
 * @datecreated 19.12.2024
 * @lastmodified 21.04.2025
 */

import React, { useState, useEffect } from 'react';
import { View, SectionList, ActivityIndicator, RefreshControl, Alert, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
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
    fetchUserProfile,
} from '../utils/apiService';
import { startPracticeSession } from '../utils/services/courseService';
import StreakPopup from '../components/StreakPopup';
import CourseCompletionPopup from '../components/CourseCompletionPopup';

const { width } = Dimensions.get('window');

const CoursesPage = ({ navigation, route }) => {
    const [showCard, setShowCard] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [userLanguage, setUserLanguage] = useState(null);
    const [isUserPremium, setIsUserPremium] = useState(false);
    const [userData, setUserData] = useState({
        streakCount: 0,
        languagePreference: 'ASL',
        unreadNotifications: 0,
        totalPoints: 0
    });
    const [showStreakPopup, setShowStreakPopup] = useState(false);
    const [streakMessage, setStreakMessage] = useState('');
    
    // New state for course completion popup
    const [showCompletionPopup, setShowCompletionPopup] = useState(false);
    const [completionData, setCompletionData] = useState({
        isPracticeMode: false,
        isPassed: false,
        successRate: 0,
        userPoints: 0
    });

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
        if (route?.params?.showCompletionMessage) {
            // Prepare data for the completion popup
            const handleCompletionMessage = async () => {
                try {
                    // For regular courses, always fetch fresh user profile to get updated points
                    if (!route.params.isPracticeMode) {
                        const userProfile = await fetchUserProfile();
                        console.log('User profile for completion popup:', userProfile);
                        
                        setCompletionData({
                            isPracticeMode: route.params.isPracticeMode || false,
                            isPassed: route.params.isPassed || false,
                            successRate: route.params.successRate || 0,
                            userPoints: userProfile.totalPoints || 0
                        });
                    } else {
                        // For practice mode, points aren't relevant
                        setCompletionData({
                            isPracticeMode: true,
                            isPassed: route.params.isPassed || false,
                            successRate: route.params.successRate || 0,
                            userPoints: 0
                        });
                    }
                    
                    setShowCompletionPopup(true);
                } catch (error) {
                    console.error('Error preparing completion popup:', error);
                    // Fallback to simple alert if there's an error
                    Alert.alert(
                        route.params.isPassed ? 'Course Completed!' : 'Course Completed',
                        'Course completed. Check your progress in the courses screen.'
                    );
                }
                
                // Reset the params
                navigation.setParams({ showCompletionMessage: false });
            };
            
            handleCompletionMessage();
        }
    }, [route?.params?.showCompletionMessage]);

    useEffect(() => {
        if (route.params?.streakMessage) {
            checkAndShowStreakPopup(route.params.streakMessage);
        }
    }, [route.params]);
    
    const handleCompletionPopupClose = () => {
        setShowCompletionPopup(false);
        // Force a complete refresh of the course list
        setRefreshing(true);
        loadUserLanguageAndSections();
    };

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

            // Check if this is a practice session (completed course)
            const isPracticeMode = selectedCourse.completed === true;
            
            let exercises;
            if (isPracticeMode) {
                // Use startPracticeSession for completed courses
                const practiceSession = await startPracticeSession(selectedCourse._id);
                exercises = practiceSession.exercises || [];
            } else {
                // Normal course start
                const [fetchedExercises, progressUpdate] = await Promise.all([
                    fetchCourseExercises(selectedCourse._id),
                    updateCourseProgress(selectedCourse._id, selectedCourse.progress || 0),
                ]);
                exercises = fetchedExercises || [];
            }

            navigation.navigate('CourseDetails', {
                title: selectedCourse.name,
                description: selectedCourse.description,
                courseId: selectedCourse._id,
                exercises: exercises || [],
                isPracticeMode: isPracticeMode
            });
        } catch (error) {
            console.error('Error preparing course:', error);
            // Still navigate but with empty exercises array
            navigation.navigate('CourseDetails', {
                title: selectedCourse.name,
                description: selectedCourse.description,
                courseId: selectedCourse._id,
                exercises: [],
                isPracticeMode: false
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

    const checkAndShowStreakPopup = async (message) => {
        try {
            console.log('Showing streak popup with message:', message);
            setStreakMessage(message);
            setShowStreakPopup(true);
            navigation.setParams({ streakMessage: null });
        } catch (error) {
            console.error('Error showing streak popup:', error);
        }
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
                                completed={section.courses.every(course => course.completed)}
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
                        isPracticeMode={selectedCourse.completed === true}
                    />
                )}
            </View>

            <StreakPopup
                visible={showStreakPopup}
                message={streakMessage}
                onClose={handleStreakPopupClose}
            />
            
            <CourseCompletionPopup
                visible={showCompletionPopup}
                onClose={handleCompletionPopupClose}
                isPracticeMode={completionData.isPracticeMode}
                isPassed={completionData.isPassed}
                successRate={completionData.successRate}
                userPoints={completionData.userPoints}
                pointsEarned={50}
            />
        </View>
    );
};

export default CoursesPage;

