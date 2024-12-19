/**
 * @file CourseDetails.js
 * @description Shows the details of a course.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import styles from '../styles/styles';

// Course Details Page Layout
const CourseDetailsPage =
    () => {
        return (
            <View
                style={
                    styles.container
                }>
                <Text
                    style={
                        styles.text
                    }>
                    Course Details
                    Page
                </Text>
            </View>
        );
    };

export default CourseDetailsPage;
