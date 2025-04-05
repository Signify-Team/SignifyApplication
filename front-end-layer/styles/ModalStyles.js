/**
 * @file ModalStyles.js
 * @description Shared styles for modal components
 *
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';

export default StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: COLORS.soft_container_color,
        borderRadius: 20,
        padding: 20,
        width: '80%',
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontFamily: FONTS.baloo_font,
        fontSize: 24,
        marginBottom: 15,
        textAlign: 'center',
    },
    message: {
        fontFamily: FONTS.poppins_font,
        fontSize: 16,
        color: COLORS.neutral_base_dark,
        marginBottom: 10,
        textAlign: 'center',
    },
    warningText: {
        fontFamily: FONTS.poppins_font,
        fontSize: 14,
        color: COLORS.button_color,
        marginBottom: 20,
        textAlign: 'center',
        fontStyle: 'italic'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: COLORS.light_gray_2,
    },
    actionButton: {
        backgroundColor: COLORS.highlight_color_2,
    },
    dangerButton: {
        backgroundColor: COLORS.button_color,
    },
    buttonText: {
        fontFamily: FONTS.poppins_font,
        fontSize: 16,
    },
    cancelButtonText: {
        color: COLORS.neutral_base_dark,
    },
    actionButtonText: {
        color: COLORS.white,
    }
}); 