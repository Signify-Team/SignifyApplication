/**
 * @file QuestsCard.js
 * @description Quests card component for the quests page.
 *
 * @datecreated 16.12.2024
 * @lastmodified 31.03.2025
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import styles from '../styles/QuestsCardStyle';
import FlameIcon from '../assets/icons/header/streak.png';
import KoalaHandIcon from '../assets/icons/header/koala-hand.png';

const QuestsCard = ({ 
    title, 
    description, 
    timeRemaining, 
    progress, 
    total, 
    isDailyQuest, 
    isCompleted, 
    onCompletePress, 
    dateCompleted,
    collected,
    onCollectPress,
    rewardPoints
}) => {
    const progressPercentage = (progress / total) * 100;
    const progressText = `${progress}/${total}`;
    const pawAnimation = useRef(new Animated.Value(0)).current;
    const flameAnimation = useRef(new Animated.Value(0)).current;
    const collectButtonAnimation = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isCompleted && !collected) {
            // Collect button pulsing animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(collectButtonAnimation, {
                        toValue: 1.05,
                        duration: 1000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.ease),
                    }),
                    Animated.timing(collectButtonAnimation, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.ease),
                    }),
                ])
            ).start();
        }

        if (!isCompleted && !isDailyQuest) {
            // Paw Animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pawAnimation, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.ease),
                    }),
                    Animated.timing(pawAnimation, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.ease),
                    }),
                ])
            ).start();
        }

        if (isDailyQuest && !isCompleted) {
            // Flame Animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(flameAnimation, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.ease),
                    }),
                    Animated.timing(flameAnimation, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.ease),
                    }),
                ])
            ).start();
        }
    }, [isCompleted, isDailyQuest, collected]);

    const formatDate = (date) => {
        if (!date) return '';
        const completionDate = new Date(date);
        const now = new Date();
        const diffInDays = Math.floor((now - completionDate) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) {
            return 'Today';
        } else if (diffInDays === 1) {
            return 'Yesterday';
        } else {
            return `${diffInDays}d ago`;
        }
    };

    const pawStyle = {
        transform: [
            {
                scale: pawAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1]
                })
            }
        ]
    };

    const flameStyle = {
        transform: [
            {
                scale: flameAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1]
                })
            }
        ]
    };

    return (
        <View style={[
            styles.cardContainer, 
            isDailyQuest && styles.timeLimitedCard,
            isCompleted && styles.completedCard
        ]}>
            <View style={styles.cardHeader}>
                <Text style={[
                    styles.cardTitle,
                    isCompleted && styles.completedText
                ]}>{title}</Text>
                {timeRemaining && !isCompleted && (
                    <Text style={styles.timeRemaining}>{timeRemaining}</Text>
                )}
                {isCompleted && dateCompleted && (
                    <Text style={styles.completionDate}>{formatDate(dateCompleted)}</Text>
                )}
            </View>

            {description && (
                <View style={styles.descriptionContainer}>
                    <Text style={styles.cardDescription} numberOfLines={2}>
                        {description}
                    </Text>
                </View>
            )}

            <View style={[
                isDailyQuest ? styles.progressBarContainerDaily : styles.progressBarContainerFriends,
                isCompleted && styles.completedProgressBar
            ]}>
                {isCompleted && !collected ? (
                    <Animated.View style={{
                        width: '100%',
                        transform: [{ scale: collectButtonAnimation }]
                    }}>
                        <TouchableOpacity 
                            style={[styles.collectButton, { 
                                width: '100%', 
                                minHeight: 52,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 12,
                                elevation: 3,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                            }]}
                            onPress={onCollectPress}
                        >
                            <Text style={[styles.collectButtonText, { 
                                fontSize: 18,
                                fontFamily: 'Poppins-SemiBold',
                                textAlign: 'center',
                                color: '#FFFFFF'
                            }]}>
                                Collect {rewardPoints} Points!
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                ) : !isCompleted ? (
                    <>
                        <View style={[
                            isDailyQuest ? styles.progressBarFillDaily : styles.progressBarFillFriends,
                            { width: `${progressPercentage}%` }
                        ]} />
                        <Text style={styles.progressText}>{progressText}</Text>
                    </>
                ) : (
                    <Text style={[styles.progressText, styles.completedProgressText]}>
                        Collected
                    </Text>
                )}
            </View>

            {!isCompleted && (
                <>
                    {isDailyQuest && (
                        <Animated.Image 
                            source={FlameIcon} 
                            style={[styles.icon, flameStyle]} 
                        />
                    )}
                    {!isDailyQuest && (
                        <Animated.Image 
                            source={KoalaHandIcon} 
                            style={[styles.koalaIcon, pawStyle]} 
                        />
                    )}
                </>
            )}
        </View>
    );
};

export default QuestsCard;
