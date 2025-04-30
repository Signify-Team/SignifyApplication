/**
 * @file AchievementPopupStyles.js
 * @description Styles for the achievement collection popup component
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../utils/constants';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popup: {
        backgroundColor: COLORS.soft_pink_background,
        borderRadius: 25,
        padding: 25,
        width: width * 0.85,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    icon: {
        width: 60,
        height: 60,
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 15,
        textAlign: 'center',
        width: '100%',
    },
    message: {
        fontSize: 16,
        color: COLORS.neutral_base_dark,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    xpContainer: {
        backgroundColor: COLORS.secondary,
        borderRadius: 15,
        padding: 12,
        marginBottom: 20,
        width: '60%',
        alignItems: 'center',
        shadowColor: COLORS.secondary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    xpText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    totalPointsText: {
        fontSize: 14,
        color: COLORS.white,
        marginTop: 5,
        opacity: 0.8,
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 12,
        width: '60%',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 