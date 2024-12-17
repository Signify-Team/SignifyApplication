/**
 * @file CoursesPage.js
 * @description Courses page of the application including different courses according
 *              to the curriculum.
 *
 * @datecreated 05.11.2024
 * @lastmodified 07.11.2024
 */

import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import styles from '../styles/styles';
import CoursesTopBar from '../components/CoursesTopBar';

// Courses Page layout
const CoursesPage =
    () => {
        return (
            <>
                {/* Custom Top Bar */}
                <CoursesTopBar />
                {/* Main content */}
                <View style={styles.container}>
                    <Text style={styles.text}>Courses Page</Text>
                </View>
            </>
        );
    };

export default CoursesPage;
