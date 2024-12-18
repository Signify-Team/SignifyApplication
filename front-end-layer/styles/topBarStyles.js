/**
 * @file styles.js
 * @description Includes styles for the texts, buttons, etc.
 *
 * @datecreated 05.11.2024
 * @lastmodified 17.12.2024
 */

import {
    StyleSheet,
    Dimensions,
} from 'react-native';
import {
    COLORS,
} from '../utils/constants';

const {width, height} =
    Dimensions.get(
        'window',
    );

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: width * 0.02,
        paddingVertical: height * 0.005,
        backgroundColor: COLORS.primary_color,
    },
    flagIcon: {
        width:   47,
        height:  33,
    },
    notifIcon: {
        width: width * 0.1,
        height: height * 0.035,
    },
    streakIcon: {
        width: width * 0.06,
        height: width * 0.06,
    },
    center: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.2,
    },
    smallIcon: {
        width: width * 0.06,
        height: width * 0.06,
        marginRight: width * 0.01,
    },
    streakText: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#FF5722',
        textAlignVertical: 'center',
    },
    notificationContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -height * 0.007,
        right: -width * 0.015,
        backgroundColor: '#FF0000',
        borderRadius: width * 0.04,
        width: width * 0.04,
        height: width * 0.04,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: width * 0.025,
        fontWeight: 'bold',
    },
});
