/**
 * @file CoursePath.js
 * @description Creates the paths between course buttons and handles on click operations on course buttons.
 *
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import CircularButton from './CircularButton';
import PremiumModal from './PremiumModal';
import styles from '../styles/CoursesPageStyles';
import { COLORS } from '../utils/constants';
import KoalaIcon from '../assets/icons/header/koala-hand.png';
import KoalaBWIcon from '../assets/icons/header/koala-hand-bw.png';

const CoursePath = ({ courses, onCoursePress, isUserPremium }) => {
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [selectedPremiumCourse, setSelectedPremiumCourse] = useState(null);

    const handleCoursePress = (course) => {
        if (course.isPremium && !isUserPremium && !course.isLocked) {
            // Show modal for non-premium users clicking on premium courses
            setSelectedPremiumCourse(course);
            setShowPremiumModal(true);
            return;
        }
        onCoursePress(course);
    };

    const handleUpgrade = async () => {
        // TODO: Implement upgrade logic later
        setShowPremiumModal(false);
    };

    return (
        <View>
            <View style={{ height: courses?.length * 150 }}>
                <Svg height="100%" width="100%" style={styles.pathContainer}>
                    {courses?.map((course, index) => {
                        // Don't draw path for the last course
                        if (index === courses.length - 1) return null;

                        const isLeft = index % 2 === 0;
                        const nextIsLeft = (index + 1) % 2 === 0;
                        const nextCourse = courses[index + 1];

                        const startX = isLeft ? 100 : 300;
                        const startY = index * 150 + 55;
                        const endX = nextIsLeft ? 100 : 300;
                        const endY = (index + 1) * 150 + 55;

                        const controlX1 = startX + (endX - startX) * 0.25;
                        const controlY1 = startY + 100;
                        const controlX2 = endX - (endX - startX) * 0.25;
                        const controlY2 = endY - 100;

                        // Path style based on lock status
                        const isPathLocked = course.isLocked || nextCourse.isLocked;
                        const pathColor = "#666666";

                        return (
                            <Path
                                key={`${course.courseId}-to-${nextCourse.courseId}`}
                                d={`M${startX},${startY} 
                                    C${controlX1},${controlY1} 
                                    ${controlX2},${controlY2} 
                                    ${endX},${endY}`}
                                stroke={pathColor}
                                strokeWidth="2.5"
                                strokeDasharray={isPathLocked ? "6,4" : "none"}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity={1}
                            />
                        );
                    })}
                </Svg>
                {courses?.map((course, index) => {
                    // Base color based on premium status, lock status, and index
                    let baseColor;
                    if (course.isPremium) {
                        baseColor = course.isLocked ? "#BBBBBB" : COLORS.premium_gold;
                    } else {
                        baseColor = course.isLocked 
                            ? "#BBBBBB"
                            : index % 3 === 0 
                                ? COLORS.primary 
                                : index % 3 === 1 
                                    ? COLORS.secondary 
                                    : COLORS.tertiary;
                    }

                    return (
                        <View key={course.courseId} style={{ height: 150 }}>
                            <View style={[
                                styles.buttonRow,
                                index % 2 === 0 ? styles.leftButton : styles.rightButton,
                                styles.buttonContainer,
                            ]}>
                                <CircularButton
                                    icon={course.isLocked ? KoalaBWIcon : KoalaIcon}
                                    color={baseColor}
                                    onPress={() => handleCoursePress(course)}
                                    disabled={course.isLocked}
                                    completed={course.completed}
                                />
                            </View>
                        </View>
                    );
                })}
            </View>
            <PremiumModal
                visible={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                onUpgrade={handleUpgrade}
            />
        </View>
    );
};

export default CoursePath; 