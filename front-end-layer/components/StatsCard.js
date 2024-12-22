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
    showIcon = true,
    showText = true,
    iconStyle,
    textStyle,
}) => {
    return (
        <View style={[styles.statsContainer, { height: statsHeight, width: statsWidth }]}>
            {showIcon && icon && (
                <Image source={icon} style={[styles.statsIcon, iconStyle]} />
            )}
            {showText && text && (
                <Text style={[styles.statsText, textStyle]}>{text}</Text>
            )}
        </View>
    );
};

export default StatsCard;
