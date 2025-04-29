/**
 * @file CourseCompletionPopupStyle.js
 * @description Styles for the course completion popup component
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
        width: width * 0.85,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    iconContainer: {
        width: width * 0.25,
        height: width * 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontFamily: FONTS.baloo_font,
        color: COLORS.neutral_base_dark,
        marginBottom: 15,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: COLORS.neutral_base_medium,
        marginBottom: 20,
        textAlign: 'center',
        lineHeight: 22,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 10,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontFamily: FONTS.game_button_font,
        fontWeight: 'bold',
    },
}); 