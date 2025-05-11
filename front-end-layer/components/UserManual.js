import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    Animated,
} from 'react-native';
import { COLORS } from '../utils/constants';

const UserManual = ({ visible, onClose }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    
    const pages = [
        {
            title: "Welcome to Signify! 👋",
            content: "Your journey to mastering sign language starts here! Let's explore some features together.",
            image: require('../assets/icons/header/koala-hand.png'),
            bgColor: '#FFF5F5',
        },
        {
            title: "Daily Streaks & Rewards 🌟",
            content: "• Complete lessons daily to maintain your streak\n• Earn points and unlock achievements\n• Get special rewards for consistent learning\n• Track your progress in your profile",
            image: require('../assets/icons/header/streak.png'),
            bgColor: '#F0FFF4',
        },
        {
            title: "Interactive Learning 🎯",
            content: "• Watch video demonstrations\n• Practice with interactive exercises\n• Get instant feedback on your signs\n• Learn at your own pace",
            image: require('../assets/icons/header/award.png'),
            bgColor: '#F0F7FF',
        },
        {
            title: "Community Features 👥",
            content: "• Connect with other learners\n• Follow friends and mentors\n• View others' points and streak\n• Learn together!",
            image: require('../assets/icons/header/followerIcon.png'),
            bgColor: '#FFF8F0',
        },
        {
            title: "Starting a Course 📚",
            content: "• Choose your preferred sign language (ASL/TID)\n• Browse available courses in the Courses tab\n• Tap on a course to see its details\n• Click the circular button to begin learning\n• Complete exercises to earn points",
            image: require('../assets/icons/header/award.png'),
            bgColor: '#F5F0FF',
            showButtonExample: true,
            showCoursesExample: true,
        },
        {
            title: "Notifications & Progress 🔔",
            content: "• Check notifications for updates\n• View your streak count in the top bar\n• Get notified about course completions\n• Track your daily progress\n• See your points and achievements",
            image: require('../assets/icons/header/notifications.png'),
            bgColor: '#FFF0F5',
        },
        {
            title: "Ready to Start? 🚀",
            content: "You're all set to begin your sign language journey! Remember, practice makes perfect!",
            image: require('../assets/icons/header/koala-hand.png'),
            bgColor: '#F0F7FF',
        }
    ];

    useEffect(() => {
        if (visible) {
            fadeAnim.setValue(1);
            scaleAnim.setValue(1);
        }
    }, [visible]);

    const animateTransition = (direction) => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (direction === 'next') {
                setCurrentPage(prev => prev + 1);
            } else {
                setCurrentPage(prev => prev - 1);
            }
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    const handleNext = () => {
        if (currentPage < pages.length - 1) {
            animateTransition('next');
        } else {
            onClose();
        }
    };

    const handleBack = () => {
        if (currentPage > 0) {
            animateTransition('back');
        }
    };

    const handleSkip = () => {
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: pages[currentPage].bgColor }]}>
                    <TouchableOpacity 
                        style={styles.skipButton}
                        onPress={handleSkip}
                    >
                        <Text style={styles.skipButtonText}>Skip</Text>
                    </TouchableOpacity>

                    <ScrollView style={styles.scrollView}>
                        <Animated.View style={[
                            styles.imageContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }]
                            }
                        ]}>
                            {pages[currentPage].showCoursesExample ? (
                                <View style={styles.coursesExample}>
                                    <View style={styles.buttonWithText}>
                                        <View style={styles.buttonExample}>
                                            <Image 
                                                source={require('../assets/icons/header/koala-hand.png')}
                                                style={styles.buttonIcon}
                                            />
                                        </View>
                                        <Text style={styles.buttonExampleLabel}>Click on the circular button to start a course</Text>
                                    </View>
                                </View>
                            ) : (
                                <Image
                                    source={pages[currentPage].image}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            )}
                        </Animated.View>
                        <Text style={styles.title}>{pages[currentPage].title}</Text>
                        <Text style={styles.text}>{pages[currentPage].content}</Text>
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        {currentPage > 0 && (
                            <TouchableOpacity
                                style={[styles.button, styles.backButton]}
                                onPress={handleBack}
                            >
                                <Text style={[styles.buttonText, styles.backButtonText]}>← Back</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[styles.button, styles.nextButton]}
                            onPress={handleNext}
                        >
                            <Text style={styles.buttonText}>
                                {currentPage === pages.length - 1 ? "Let's Start! 🚀" : "Next →"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: Dimensions.get('window').width * 0.9,
        maxHeight: Dimensions.get('window').height * 0.8,
        borderRadius: 25,
        padding: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    skipButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 1,
        padding: 8,
    },
    skipButtonText: {
        color: '#666',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    scrollView: {
        marginBottom: 20,
        marginTop: 10,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        minHeight: 150,
    },
    image: {
        width: '80%',
        height: 150,
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: 15,
    },
    text: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingHorizontal: 10,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 20,
        alignItems: 'center',
        marginHorizontal: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    backButton: {
        backgroundColor: '#F5F5F5',
    },
    nextButton: {
        backgroundColor: COLORS.button_color,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    backButtonText: {
        color: '#666',
    },
    coursesExample: {
        width: '100%',
        alignItems: 'center',
        padding: 15,
    },
    buttonWithText: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        width: '100%',
    },
    buttonExample: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderColor: COLORS.button_underline,
        borderBottomWidth: 4,
        flexShrink: 0,
    },
    buttonIcon: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    buttonExampleLabel: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#333',
        flex: 1,
    },
});

export default UserManual; 