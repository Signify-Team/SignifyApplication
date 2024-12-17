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
        flex: 1,
        backgroundColor: COLORS.neutral_base_soft,
        paddingTop: height * 0.005,
        paddingHorizontal: width * 0.05,
    },
    sectionTitle: {
        fontSize: 20,
        marginTop: height * 0.02,
        marginBottom: height * 0.01,
        color: COLORS.dark_accent,
    },
    settingCard: {
        backgroundColor: COLORS.light_gray_2,
        borderRadius: 12,
        marginBottom: height * 0.005,
        elevation: 2,
        borderColor: COLORS.light_gray_1,
        borderWidth: 1,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.05,
        borderBottomWidth: 1,
        borderColor: COLORS.light_gray_1,
    },
    optionText: {
        fontSize: 16,
        color: COLORS.neutral_base_dark,
    },
    arrow: {
        fontSize: 16,
        color: COLORS.dark_gray_1,
    },
    footerText: {
        fontSize: 11,
        color: COLORS.dark_gray_1,
        textAlign: 'center',
        marginVertical: 5,
    },
    logoutText: {
        fontSize: 16,
        color: COLORS.highlight_color_2,
        textAlign: 'center',
        marginVertical: height * 0.025,
        textDecorationLine: 'underline',
    },
    switchWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 60, // Set fixed width for consistency
        height: 30, // Adjust height to fit smaller switches
    },
    switch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
});
