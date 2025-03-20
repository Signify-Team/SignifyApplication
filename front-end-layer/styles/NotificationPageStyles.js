/**
 * @file NotificationPageStyles.js
 * @description Includes styles for the notification page components
 *
 * @datecreated 23.12.2024
 */

import {
    StyleSheet,
    Dimensions,
} from 'react-native';
import {
    COLORS,
    FONTS,
} from '../utils/constants';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral_base_soft,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: COLORS.neutral_base_soft,
        paddingTop: height * 0.08,
        marginBottom: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: FONTS.poppins_font,
        color: COLORS.neutral_base_dark,
        letterSpacing: -0.5,
        fontWeight: '600',
        flex: 1,
        marginLeft: 8,
    },
    markAllReadButton: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: COLORS.neutral_base_soft,
        borderTopWidth: 1,
        borderTopColor: COLORS.neutral_base_soft,
        alignItems: 'center',
        marginBottom: 20,
    },
    markAllReadText: {
        color: COLORS.primary,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        textDecorationLine: 'underline',
    },
    notificationsList: {
        padding: 16,
        flexGrow: 1,
    },
    notificationItem: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    unreadNotification: {
        backgroundColor: COLORS.soft_pink_background,
    },
    notificationIconContainer: {
        position: 'relative',
        marginRight: 8,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationIcon: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    unreadDot: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.secondary,
        borderWidth: 1,
        borderColor: COLORS.white,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontFamily: 'Baloo2-Bold',
        color: COLORS.neutral_base_dark,
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: COLORS.dark_gray_1,
        marginBottom: 8,
    },
    notificationTime: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: COLORS.dark_gray_1,
    },
    loadingText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: COLORS.white,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    backIcon: {
        width: 24,
        height: 24,
    },
}); 