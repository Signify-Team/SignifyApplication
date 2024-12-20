/**
 * @file QuestsCardStyle.js
 * @description Includes styles for the quests card component.
 *
 * @datecreated 17.12.2024
 * @lastmodified 17.12.2024
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS} from '../utils/constants';

const {width, height} =
    Dimensions.get(
        'window',
    );

export default StyleSheet.create({
    header: {
        fontFamily: FONTS.baloo_font,
        fontSize: 22,
        color: COLORS.dark_accent,
        marginBottom: height * 0.02,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral_base_soft,
        paddingTop: height * 0.1,
        paddingHorizontal: width * 0.05,
    },
    cardContainer: {
        marginBottom: height * 0.02,
        backgroundColor: COLORS.gray,
        padding: 16,
        borderRadius: 12,
        minHeight: height * 0.12,
        justifyContent: 'center',
    },
    timeLimitedCard: {
        backgroundColor: COLORS.soft_pink_background,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    cardTitle: {
        fontFamily: FONTS.baloo_font,
        fontSize: 20,
        color: COLORS.dark_accent,
        marginBottom: height * 0.01,
    },
    timeRemaining: {
        fontFamily: FONTS.poppins_font,
        fontSize: 17,
        color: COLORS.button_color,
        marginBottom: height * 0.01,
    },
    progressBarContainerDaily: {
        height: height * 0.02,
        backgroundColor: COLORS.gray,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: height * 0.02,
        position: 'relative',
        justifyContent: 'center',
    },
    progressBarContainerFriends: {
        height: height * 0.02,
        backgroundColor: COLORS.dark_gray_1,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: height * 0.02,
        position: 'relative',
        justifyContent: 'center',
    },
    progressBarFillDaily: {
        height: '100%',
        backgroundColor: COLORS.button_color,
        position: 'absolute',
    },
    progressBarFillFriends: {
        height: '100%',
        backgroundColor: COLORS.primary,
        position: 'absolute',
    },
    progressText: {
        fontFamily: FONTS.baloo_font,
        color: COLORS.light_gray_2,
        fontSize: 17,
        textAlign: 'center',
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 2,
    },
    icon: {
        position: 'absolute',
        right: width * 0.005,
        bottom: height * 0.027,
        width: width * 0.13,
        height: height * 0.06,
    },
    koalaIcon: {
        position: 'absolute',
        right: 0,
        bottom: height * 0.015,
        width: width * 0.16,
        height: height * 0.08,
    },
});
