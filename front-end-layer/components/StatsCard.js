/**
 * @file StatsCard.js
 * @description Statistics and Badges card component.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import styles from '../styles/ProfileCardStyle.js';
import { COLORS } from '../utils/constants';

const StatsCard = ({
    height: statsHeight,
    width: statsWidth,
    icon,
    text,
    value,
    showIcon = true,
    showText = true,
    iconStyle,
    textStyle,
}) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const isStreakCard = icon && !text && !showText;
    const isBadgeCard = icon && !text && !value;

    const handleImageError = (error) => {
        console.error('Error loading image:', error.nativeEvent.error);
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
        setImageError(false);
    };

    // Reset loading state when icon changes
    useEffect(() => {
        setImageLoading(true);
        setImageError(false);
    }, [icon]);

    return (
        <View style={[styles.statsContainer, { height: statsHeight, width: statsWidth }]}>
            {isBadgeCard ? (
                <View style={[styles.badgeContainer, iconStyle]}>
                    <Image 
                        source={icon} 
                        style={[styles.statsIcon, iconStyle]} 
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        resizeMode="contain"
                    />
                </View>
            ) : (
                <View style={styles.statsContent}>
                    {isStreakCard ? (
                        <View style={styles.statsRow}>
                            <Image 
                                source={icon} 
                                style={[styles.statsIcon, iconStyle]} 
                                onError={handleImageError}
                                onLoad={handleImageLoad}
                                resizeMode="contain"
                            />
                            <Text style={[styles.statsValue, textStyle]}>{value}</Text>
                        </View>
                    ) : (
                        <>
                            {value !== undefined && (
                                <Text style={[styles.statsValue, textStyle]}>{value}</Text>
                            )}
                            {showText && text && (
                                <Text style={[styles.statsText, textStyle]}>{text}</Text>
                            )}
                        </>
                    )}
                </View>
            )}
        </View>
    );
};

export default StatsCard;
