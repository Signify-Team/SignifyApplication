// pages/CoursesPage.js

import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import styles from '../styles/styles';
import CoursesTopBar from '../components/CoursesTopBar';
import CircularButton from '../components/CircularButton';
import GreetingsIcon from '../assets/icons/course-info/greetings.png';
import KoalaIcon from '../assets/icons/header/koala-hand.png';
import { COLORS } from '../utils/constants';
import CourseInfoCard from '../components/CourseInfoCard';

const CoursesPage = () => {
    const [showCard, setShowCard] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Sample button data
    const buttonData = [
        { id: 0, icon: KoalaIcon, color: COLORS.primary, title: 'Course 1', description: 'This is Course 1' },
        { id: 1, icon: KoalaIcon, color: COLORS.secondary, title: 'Course 2', description: 'This is Course 2' },
        { id: 2, icon: KoalaIcon, color: COLORS.tertiary, title: 'Course 3', description: 'This is Course 3' },
    ];

    const handleButtonPress = (course) => {
        setSelectedCourse(course);
        setShowCard(true);
    };

    const handleCloseCard = () => {
        setShowCard(false);
        setSelectedCourse(null);
    };

    return (
        <>
            {/* Custom Top Bar */}
            <CoursesTopBar />
            {/* Main Content */}
            <View style={styles.container}>
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
                    <CourseInfoCard
                        title={selectedCourse.title}
                        description={selectedCourse.description}
                        onClose={handleCloseCard}
                    />
                )}
            </View>
        </>
    );
};

export default CoursesPage;
