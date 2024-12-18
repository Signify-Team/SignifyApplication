/**
 * @file StatsCard.js
 * @description Statistics and Badges card component.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import { COLORS, hexToRgba } from '../utils/constants.js';
const { width, height } = Dimensions.get('window');

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

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: hexToRgba(COLORS.neutral_base_dark, 0.1),
        padding: 10,
    },
    statsIcon: {
        width: width * 0.05,
        height: height * 0.03,
        marginRight: width * 0.03,
    },
    statsText: {
        fontSize: 16,
        color: COLORS.neutral_base_dark,
    },
});

export default StatsCard;
