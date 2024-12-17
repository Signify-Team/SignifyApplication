/**
 * @file CourseInfoCard.js
 * @description Includes styles for the course information card.
 *
 * @datecreated 17.12.2024
 * @lastmodified 17.12.2024
 */

import {
    StyleSheet,
    Dimensions,
} from 'react-native';
import {
    COLORS,
    FONTS,
} from '../utils/constants';

const {width, height} =
    Dimensions.get(
        'window',
    );

export default StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: COLORS.tertiary,
        borderRadius: 12,
        width: width * 0.95,
        height: 80,
        elevation: 3,
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    innerShadow: {
        position: 'absolute',
        top: -2,
        left: 0,
        right: 0,
        height: 10,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: {width: 0, height: 2},
    },
    icon: {
        width: width * 0.35,
        height: height * 0.2,
        marginRight: 20,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 30,
        color: COLORS.neutral_base_dark,
    },
});
