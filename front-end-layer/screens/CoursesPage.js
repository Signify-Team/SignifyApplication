/**
 * @file CoursesPage.js
 * @description Courses page of the application including different courses according
 *              to the curriculum.
 *
 * @datecreated 05.11.2024
 * @lastmodified 17.12.2024
 */

import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import styles from '../styles/styles';
import CourseInfoCard from '../components/CourseInfoCard';
import GreetingsIcon from '../assets/icons/course-info/greetings.png';
import CoursesTopBar from '../components/CoursesTopBar';

// Courses Page Layout
const CoursesPage =
    () => {
        return (
            <>
                {/* Custom Top Bar */}
                <CoursesTopBar />
                {/* Main content */}
                <View style={styles.container}>
                    <Text style={styles.text}>Courses Page</Text>
                    <CourseInfoCard icon={GreetingsIcon} title="Greetings"/>
            </View>
            </>
        );
    };

export default CoursesPage;
