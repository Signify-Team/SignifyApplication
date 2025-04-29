/**
 * @file StatsCard.js
 * @description Statistics and Badges card component.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from '../styles/ProfileCardStyle.js';

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
    const isStreakCard = icon && !text;
    const isBadgeCard = icon && !text && !value;

    return (
        <View style={[styles.statsContainer, { height: statsHeight, width: statsWidth }]}>
            {isBadgeCard ? (
                <View style={[styles.badgeContainer, iconStyle]}>
                    <Image source={icon} style={[styles.statsIcon, iconStyle]} />
                </View>
            ) : (
                <View style={styles.statsContent}>
                    {isStreakCard ? (
                        <View style={styles.statsRow}>
                            <Image source={icon} style={[styles.statsIcon, iconStyle]} />
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
