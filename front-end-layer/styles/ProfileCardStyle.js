/**
 * @file ProfileCardStyle.js
 * @description Includes styles for the profile card on the profile page.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, hexToRgba } from '../utils/constants';

const {width, height} =
    Dimensions.get(
        'window',
    );

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral_base_soft,
        paddingTop: height * 0.005,
        alignItems: 'center',
    },
    infoRow: {
        fontFamily: FONTS.poppins_font,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.neutral_base_soft,
        paddingVertical: 10,
    },
    divider: {
        width: 1,
        height: '70%',
        backgroundColor: COLORS.neutral_base_dark,
    },
    buttonRow: {
        paddingVertical: height * 0.02,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileCard: {
        fontFamily: FONTS.poppins_font,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.soft_container_color,
        borderRadius: 16,
        width: width * 0.9,
        height: height * 0.2,
        padding: 16,
        marginTop: height * 0.01,
        marginBottom: height * 0.03,
        elevation: 3,
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    avatarContainer: {
        width: width * 0.3,
        height: width * 0.3,
        borderRadius: width * 0.3,
        marginHorizontal: width * 0.03,
        backgroundColor: COLORS.neutral_base_soft,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.neutral_base_dark,
    },
    avatar: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    infoContainer: {
        marginLeft: width * 0.04,
        justifyContent: 'center',
    },
    handle: {
        fontSize: 16,
        color: COLORS.neutral_base_dark,
        marginVertical: 4,
    },
    memberSince: {
        fontSize: 16,
        color: COLORS.neutral_base_dark,
    },
    userTitle: {
        fontFamily: 'Poppins-Bold',
        fontWeight: 'bold',
    },
    header: {
        fontFamily: FONTS.baloo_font,
        fontSize: 30,
        color: COLORS.neutral_base_dark,
        marginBottom: height * 0.012,
        marginTop: height * 0.02,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width * 0.9,
        marginBottom: height * 0.01,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: COLORS.soft_container_color,
        padding: 0,
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    badgeContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsContent: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    statsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    statsIcon: {
        width: width * 0.15,
        height: width * 0.15,
        resizeMode: 'contain',
    },
    statsText: {
        fontFamily: FONTS.poppins_font,
        fontSize: 14,
        color: COLORS.neutral_base_dark,
        opacity: 0.8,
        textAlign: 'center',
        width: '100%',
    },
    statsValue: {
        fontFamily: FONTS.poppins_font,
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.neutral_base_dark,
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    badgesGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * 0.9,
        marginBottom: height * 0.01,
        gap: 10,
    },
    badgeCard: {
        flex: 1,
        aspectRatio: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
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
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontFamily: FONTS.baloo_font,
        fontSize: 24,
        color: COLORS.neutral_base_dark,
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 24,
        color: COLORS.neutral_base_dark,
        lineHeight: 24,
    },
    modalBody: {
        alignItems: 'flex-start',
        width: '100%',
    },
    modalDate: {
        fontFamily: FONTS.poppins_font,
        fontSize: 16,
        color: COLORS.neutral_base_dark,
        opacity: 0.8,
        width: '100%',
    },
    modalDescription: {
        width: '100%',
        marginBottom: 10,
    },
});
