/**
 * @file QuestCompletionPopupStyle.js
 * @description Styles for the quest completion popup
 *
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: COLORS.neutral_base_soft,
        borderRadius: 20,
        padding: 20,
        width: width * 0.85,
        alignItems: 'center',
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        marginBottom: 20,
    },
    icon: {
        width: 80,
        height: 80,
    },
    title: {
        fontFamily: FONTS.baloo_font,
        fontSize: 24,
        color: COLORS.dark_accent,
        marginBottom: 10,
    },
    questTitle: {
        fontFamily: FONTS.baloo_font,
        fontSize: 20,
        color: COLORS.primary,
        marginBottom: 10,
    },
    description: {
        fontFamily: FONTS.poppins_font,
        fontSize: 16,
        color: COLORS.dark_gray_1,
        textAlign: 'center',
        marginBottom: 20,
    },
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    rewardText: {
        fontFamily: FONTS.poppins_font,
        fontSize: 16,
        color: COLORS.dark_gray_1,
        marginRight: 5,
    },
    pointsText: {
        fontFamily: FONTS.baloo_font,
        fontSize: 18,
        color: COLORS.secondary,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 10,
    },
    buttonText: {
        fontFamily: FONTS.baloo_font,
        fontSize: 18,
        color: COLORS.neutral_base_soft,
    },
}); 