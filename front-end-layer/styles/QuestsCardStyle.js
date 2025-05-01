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
        paddingBottom: height * 0.05,
    },
    cardContainer: {
        marginBottom: height * 0.02,
        backgroundColor: COLORS.soft_pink_background,
        padding: 16,
        borderRadius: 12,
        minHeight: height * 0.12,
        justifyContent: 'center',
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    timeLimitedCard: {
        backgroundColor: COLORS.soft_pink_background,
    },
    completedCard: {
        backgroundColor: COLORS.gray,
        opacity: 0.85,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.01,
    },
    cardTitle: {
        fontFamily: FONTS.baloo_font,
        fontSize: 20,
        color: COLORS.dark_accent,
        marginBottom: height * 0.01,
    },
    cardDescription: {
        fontFamily: FONTS.poppins_font,
        fontSize: 14,
        color: COLORS.dark_gray_1,
        marginBottom: height * 0.01,
        opacity: 0.8,
    },
    descriptionContainer: {
        paddingLeft: 4,
        marginBottom: height * 0.01,
    },
    completedText: {
        color: COLORS.dark_accent,
        opacity: 0.7,
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
        backgroundColor: COLORS.gray,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: height * 0.02,
        position: 'relative',
        justifyContent: 'center',
    },
    completedProgressBar: {
        backgroundColor: COLORS.dark_gray_1,
        height: height * 0.03,
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
    completedProgressText: {
        color: COLORS.dark_accent,
        opacity: 0.7,
        fontSize: 15,
    },
    collectButton: {
        backgroundColor: COLORS.button_color,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    collectButtonText: {
        color: COLORS.white,
        fontFamily: FONTS.baloo_font,
        fontSize: 14,
    },
    completionDate: {
        fontFamily: FONTS.poppins_font,
        fontSize: 14,
        color: COLORS.dark_accent,
        opacity: 0.7,
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
    errorText: {
        fontFamily: FONTS.poppins_font,
        color: COLORS.error,
        fontSize: 16,
        textAlign: 'center',
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: COLORS.soft_container_color,
        borderRadius: 20,
        padding: 20,
        width: width * 0.8,
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontFamily: FONTS.baloo_font,
        fontSize: 24,
        color: COLORS.neutral_base_dark,
        marginBottom: height * 0.02,
    },
    modalDescription: {
        fontFamily: FONTS.poppins_font,
        fontSize: 16,
        color: COLORS.neutral_base_dark,
        marginBottom: height * 0.02,
        lineHeight: 24,
    },
    modalDeadline: {
        fontFamily: FONTS.poppins_font,
        fontSize: 14,
        color: COLORS.dark_gray_1,
        marginBottom: height * 0.01,
    },
    modalLanguage: {
        fontFamily: FONTS.poppins_font,
        fontSize: 14,
        color: COLORS.dark_gray_1,
        marginBottom: height * 0.01,
    },
    modalPoints: {
        fontFamily: FONTS.poppins_font,
        fontSize: 16,
        color: COLORS.button_color,
        marginBottom: height * 0.02,
    },
    closeButton: {
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        fontFamily: FONTS.poppins_font,
        fontSize: 16,
        color: COLORS.white,
        fontWeight: '600',
    },
    noQuestsText: {
        fontFamily: FONTS.poppins_font,
        fontSize: 16,
        color: COLORS.dark_gray_1,
        textAlign: 'center',
        marginTop: height * 0.2,
        opacity: 0.8,
    },
});
