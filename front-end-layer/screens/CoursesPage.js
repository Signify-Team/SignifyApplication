/**
 * @file CoursesPage.js
 * @description Shows the courses available for the user.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React, { useState, useEffect } from 'react';
import { View, SectionList, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import styles from '../styles/styles';
import CoursesTopBar from '../components/CoursesTopBar';
import CircularButton from '../components/CircularButton';
import KoalaIcon from '../assets/icons/header/koala-hand.png';
import GreetingsIcon from '../assets/icons/course-info/greetings.png';
import { COLORS } from '../utils/constants';
import CourseInfoCard from '../components/CourseInfoCard';
import VertCard from '../components/VertCard';
import { fetchSections } from '../utils/apiService';

const CoursesPage = ({ navigation }) => {
    const [showCard, setShowCard] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSections();
    }, []);

    const loadSections = async () => {
        try {
            const sectionsData = await fetchSections();
            setSections(sectionsData);
        } catch (error) {
            console.error('Error loading sections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleButtonPress = (course) => {
        setSelectedCourse(course);
        setShowCard(true);
    };

    const handleNavigateToCourse = () => {
        navigation.navigate('CourseDetails', {
            title: selectedCourse.name,
            description: selectedCourse.description,
        });
    };

    const renderSectionHeader = ({ section }) => (
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <CourseInfoCard 
                icon={GreetingsIcon} 
                title={section.name} 
            />
        </View>
    );

    const renderItem = ({ item, section, index }) => (
        <View style={{ height: 150 }}>
            <View
                style={[
                    styles.buttonRow,
                    index % 2 === 0 ? styles.leftButton : styles.rightButton,
                ]}
            >
                <CircularButton
                    icon={KoalaIcon}
                    color={item.isPremium ? COLORS.gold : (index % 3 === 0 ? COLORS.primary : index % 3 === 1 ? COLORS.secondary : COLORS.tertiary)}
                    onPress={() => handleButtonPress(item)}
                />
            </View>
        </View>
    );

    const renderSection = ({ section }) => (
        <View>
            <View style={{ height: section.courses?.length * 150 }}>
                <Svg
                    height="100%"
                    width="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                >
                    {section.courses?.slice(1).map((item, index) => {
                        const isLeft = index % 2 === 0;
                        const nextIsLeft = (index + 1) % 2 === 0;

                        const startX = isLeft ? 100 : 300;
                        const startY = index * 150 + 55;
                        const endX = nextIsLeft ? 100 : 300;
                        const endY = (index + 1) * 150 + 55;

                        const controlX1 = startX + (endX - startX) * 0.25;
                        const controlY1 = startY + 100;
                        const controlX2 = endX - (endX - startX) * 0.25;
                        const controlY2 = endY - 100;

                        return (
                            <Path
                                key={item.courseId}
                                d={`M${startX},${startY} 
                                    C${controlX1},${controlY1} 
                                    ${controlX2},${controlY2} 
                                    ${endX},${endY}`}
                                stroke="black"
                                strokeWidth="2"
                                strokeDasharray="4,4"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        );
                    })}
                </Svg>
                {section.courses?.map((course, index) => (
                    <View
                        key={course.courseId}
                        style={{ height: 150 }}
                    >
                        <View
                            style={[
                                styles.buttonRow,
                                index % 2 === 0 ? styles.leftButton : styles.rightButton,
                            ]}
                        >
                            <CircularButton
                                icon={KoalaIcon}
                                color={course.isPremium ? COLORS.gold : (index % 3 === 0 ? COLORS.primary : index % 3 === 1 ? COLORS.secondary : COLORS.tertiary)}
                                onPress={() => handleButtonPress(course)}
                            />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );

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
                <SectionList
                    sections={sections.map(section => ({
                        ...section,
                        data: [section] // Pass the entire section as data
                    }))}
                    renderItem={renderSection}
                    renderSectionHeader={renderSectionHeader}
                    stickySectionHeadersEnabled={true}
                    keyExtractor={item => item._id}
                />
                {showCard && selectedCourse && (
                    <VertCard
                        title={selectedCourse.name}
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
