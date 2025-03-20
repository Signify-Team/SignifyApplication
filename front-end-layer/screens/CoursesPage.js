/**
 * @file CoursesPage.js
 * @description Shows the courses available for the user.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import styles from '../styles/styles';
import CoursesTopBar from '../components/CoursesTopBar';
import CircularButton from '../components/CircularButton';
import GreetingsIcon from '../assets/icons/course-info/greetings.png';
import KoalaIcon from '../assets/icons/header/koala-hand.png';
import { COLORS } from '../utils/constants';
import CourseInfoCard from '../components/CourseInfoCard';
import VertCard from '../components/VertCard';
import { getAllCourses, startCourse } from '../utils/apiService';

const CoursesPage = ({ navigation }) => {
    const [showCard, setShowCard] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const coursesData = await getAllCourses();
            // Map the courses data to match our button data structure
            const mappedCourses = coursesData.map((course, index) => ({
                id: course._id,
                icon: KoalaIcon,
                color: [COLORS.primary, COLORS.secondary, COLORS.tertiary][index % 3],
                title: course.name,
                description: course.description,
                level: course.level,
                exercises: course.exercises
            }));
            setCourses(mappedCourses);
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const handleButtonPress = (course) => {
        setSelectedCourse(course);
        setShowCard(true);
    };

    const handleNavigateToCourse = async () => {
        try {
            await startCourse(selectedCourse.id);
            navigation.navigate('CourseDetails', {
                courseId: selectedCourse.id,
                title: selectedCourse.title,
                description: selectedCourse.description,
                level: selectedCourse.level,
                exercises: selectedCourse.exercises
            });
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to start course');
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <>
            <CoursesTopBar />
            <View style={styles.container}>
                <CourseInfoCard icon={GreetingsIcon} title="Greetings" />
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Svg
                        height="100%"
                        width="100%"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    >
                        {courses.slice(1).map((item, index) => {
                            const prevButton = courses[index];
                            const isLeft = index % 2 === 0;
                            const nextIsLeft = (index + 1) % 2 === 0;

                            const startX = isLeft ? 100 : 300;
                            const startY = index * 150 + 75;
                            const endX = nextIsLeft ? 100 : 300;
                            const endY = (index + 1) * 150 + 75;

                            const controlX1 = startX + (endX - startX) * 0.25;
                            const controlY1 = startY + 100;
                            const controlX2 = endX - (endX - startX) * 0.25;
                            const controlY2 = endY - 100;

                            return (
                                <Path
                                    key={item.id}
                                    d={`M${startX},${startY} 
                                        C${controlX1},${controlY1} 
                                        ${controlX2},${controlY2} 
                                        ${endX},${endY}`}
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeDasharray="4,4"
                                    fill="none"
                                />
                            );
                        })}
                    </Svg>
                    {courses.map((item, index) => (
                        <View
                            key={item.id}
                            style={[
                                styles.buttonRow,
                                index % 2 === 0 ? styles.leftButton : styles.rightButton,
                            ]}
                        >
                            <CircularButton
                                icon={item.icon}
                                color={item.color}
                                onPress={() => handleButtonPress(item)}
                            />
                        </View>
                    ))}
                </ScrollView>
                {showCard && (
                    <VertCard
                        title={selectedCourse.title}
                        description={selectedCourse.description}
                        level={selectedCourse.level}
                        buttonText="START"
                        onPress={handleNavigateToCourse}
                    />
                )}
            </View>
        </>
    );
};

export default CoursesPage;
