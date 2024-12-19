/**
 * @file CoursesPage.js
 * @description Shows the courses available for the user.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import styles from '../styles/styles';
import CoursesTopBar from '../components/CoursesTopBar';
import CircularButton from '../components/CircularButton';
import GreetingsIcon from '../assets/icons/course-info/greetings.png';
import KoalaIcon from '../assets/icons/header/koala-hand.png';
import { COLORS } from '../utils/constants';
import CourseInfoCard from '../components/CourseInfoCard';
import VertCard from '../components/VertCard';

const CoursesPage = ({ navigation }) => {
    const [showCard, setShowCard] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const buttonData = [
        { id: 0, icon: KoalaIcon, color: COLORS.primary, title: 'Course 1', description: 'This is Course 1' },
        { id: 1, icon: KoalaIcon, color: COLORS.secondary, title: 'Course 2', description: 'This is Course 2' },
        { id: 2, icon: KoalaIcon, color: COLORS.tertiary, title: 'Course 3', description: 'This is Course 3' },
    ];

    const handleButtonPress = (course) => {
        setSelectedCourse(course);
        setShowCard(true);
    };

    const handleNavigateToCourse = () => {
        navigation.navigate('CourseDetails', {
            title: selectedCourse.title,
            description: selectedCourse.description,
        });
    };

    return (
        <>
            {/* Courses Top Bar */}
            <CoursesTopBar />
            <View style={styles.container}>
                {/* Course Info Card */}
                <CourseInfoCard icon={GreetingsIcon} title="Greetings" />
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {buttonData.map((item) => (
                        <View
                            key={item.id}
                            style={[
                                styles.buttonRow,
                                item.id % 2 === 0 ? styles.leftButton : styles.rightButton,
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
                        buttonText="START"
                        onPress={handleNavigateToCourse}
                    />
                )}
            </View>
        </>
    );
};

export default CoursesPage;
