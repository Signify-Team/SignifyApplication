/**
 * @file CoursesPage.js
 * @description Courses page of the application including different courses according
 *              to the curriculum. Buttons alternate between left and right positions with customizable colors.
 *
 * @datecreated 05.11.2024
 * @lastmodified 19.12.2024
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import styles from '../styles/styles';
import CoursesTopBar from '../components/CoursesTopBar';
import CircularButton from '../components/CircularButton';
import GreetingsIcon from '../assets/icons/course-info/greetings.png';
import KoalaHand from '../assets/icons/header/koala-hand.png';
import CourseInfoCard from '../components/CourseInfoCard';
import { COLORS } from '../utils/constants';

const CoursesPage = () => {
    // Array to represent the buttons with customizable colors
    const buttonData = [
        { id: 0, icon: KoalaHand, color: COLORS.primary },
        { id: 1, icon: KoalaHand, color: COLORS.secondary },
        { id: 2, icon: KoalaHand, color: COLORS.tertiary },
        { id: 3, icon: KoalaHand, color: COLORS.quaternary },
        { id: 4, icon: KoalaHand, color: COLORS.highlight_color_2 },
    ];

    return (
        <>
            {/* Top Bar */}
            <CoursesTopBar />
            {/* Main content */}
            <View style={styles.container}>
            <CourseInfoCard icon={GreetingsIcon} title="Greetings"/>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {buttonData.map((item) => (
                        <View
                            key={item.id}
                            style={[
                                styles.buttonRow,
                                item.id % 2 === 0 ? styles.leftButton : styles.rightButton,
                            ]}
                        >
                            <CircularButton icon={item.icon} color={item.color} />
                        </View>
                    ))}
                </ScrollView>
            </View>
        </>
    );
};

export default CoursesPage;
