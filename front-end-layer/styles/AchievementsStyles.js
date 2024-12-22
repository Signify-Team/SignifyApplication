/**
 * @file AchievementsStyles.js
 * @description Styles for the Achievements page.
 *
 * @datecreated 20.12.2024
 * @lastmodified 20.12.2024
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral_base_soft,
        padding: height * 0.02,
    },
    cardContainer: {
        backgroundColor: COLORS.soft_container_color,
        borderRadius: 20,
        paddingVertical: height * 0.025,
        paddingHorizontal: width * 0.05,
        marginBottom: height * 0.02,
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
    },
    sectionTitle: {
        fontSize: 30,
        fontFamily: FONTS.baloo_font,
        color: COLORS.neutral_base_dark,
        textAlign: 'center',
        marginBottom: height * 0.018,
    },
    rewardBox: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: COLORS.neutral_base_dark,
        borderRadius: 15,
        backgroundColor: COLORS.neutral_base_soft,
    },
    rewardContainer: {
        alignItems: 'center',
    },
    rewardImage: {
        width: width * 0.12,
        height: height * 0.06,
        marginBottom: height * 0.015,
    },
    rewardImageDisabled: {
        opacity: 0.4,
    },
});
