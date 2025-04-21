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
    COLORS, FONTS,
} from '../utils/constants';

const {width, height} =
    Dimensions.get(
        'window',
    );

export default StyleSheet.create({
    container: {
        paddingTop: height * 0.07,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: width * 0.02,
        paddingVertical: height * 0.005,
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 1,
    },
    leftIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: width * 0.01,
    },
    dictionaryIcon: {
        height: height * 0.05,
        aspectRatio: 1,
        resizeMode: 'contain',
    },
    courseDetailsContainer: {
        width: '100%',
        paddingTop: height * 0.07,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.005,
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 1,
    },
    flagIcon: {
        width:   width * 0.15,
        height:  height * 0.03,
    },
    settingsIcon: {
        width: width * 0.12,
        height: height * 0.04,
        marginLeft: width * 0.85,
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
        width: width * 0.25,
    },
    smallIcon: {
        width: width * 0.06,
        height: width * 0.06,
        marginRight: width * 0.01,
    },
    streakText: {
        fontFamily: FONTS.poppins_font,
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#FF5722',
        textAlignVertical: 'center',
    },
    streakBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        right: width * 0.04,
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
        fontFamily: FONTS.poppins_font,
        color: '#FFFFFF',
        fontSize: width * 0.025,
        fontWeight: 'bold',
    },
    backIcon: {
        width: width * 0.08,
        height: width * 0.08,
        tintColor: COLORS.neutral_base_soft,
    },
});
