/**
 * @file CoursesPage.js
 * @description Shows the courses available for the user.
 *
 * @datecreated 19.12.2024
 * @lastmodified 21.04.2025
 */

import React, { useState, useEffect } from 'react';
import { View, SectionList, ActivityIndicator, RefreshControl } from 'react-native';
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
} from '../utils/apiService';

const CoursesPage = ({ navigation }) => {
    const [showCard, setShowCard] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [userLanguage, setUserLanguage] = useState(null);
    const [isUserPremium, setIsUserPremium] = useState(false);

    useEffect(() => {
        loadUserLanguageAndSections();
        loadUserPremiumStatus();
    }, []);

    useEffect(() => {
        if (userLanguage) {
            setRefreshing(true);
            loadSections(userLanguage);
        }
    }, [userLanguage]);

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

    const loadSections = async (language) => {
        try {
            const [sectionsData, userCoursesData] = await Promise.all([
                fetchSectionsByLanguage(language),
                fetchUserCourses(),
            ]);

            const processedSections = sectionsData.map((section, sectionIndex) => ({
                ...section,
                isLocked: sectionIndex === 0 ? false : !userCoursesData.unlockedSections?.includes(section._id),
                courses: section.courses.map(course => {
                    const userCourse = userCoursesData.find(uc => uc.courseId === course.courseId);

                    // A course is unlocked only if it exists in userCourses with isLocked = false
                    const isLocked = !userCourse || userCourse.isLocked;

                    return {
                        ...course,
                        isLocked,
                        progress: userCourse?.progress || 0,
                    };
                }),
            }));

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
        </View>
    );
};

export default CoursesPage;

