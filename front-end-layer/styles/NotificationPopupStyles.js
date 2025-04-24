/**
 * @file NotificationPopupStyles.js
 * @description Styles for the notification popup component
 * @datecreated 31.03.2025
 */

import {
    StyleSheet,
    Dimensions,
} from 'react-native';
import {
    COLORS,
    FONTS,
} from '../utils/constants';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: width * 0.85,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Baloo2-Bold',
        color: COLORS.neutral_base_dark,
        flex: 1,
    },
    closeButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 24,
        color: COLORS.dark_gray_1,
        fontFamily: 'Poppins-Regular',
    },
    content: {
        marginBottom: 20,
    },
    message: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: COLORS.dark_gray_1,
        lineHeight: 24,
    },
    okButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    okButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: COLORS.white,
    },
}); 