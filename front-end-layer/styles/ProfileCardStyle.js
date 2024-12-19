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
    userTitle: {
        fontFamily: "Poppins-Bold",
        fontWeight: "bold",
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
        borderRadius: 12,
        backgroundColor: hexToRgba(COLORS.neutral_base_dark, 0.1),
        padding: 10,
    },
    statsIcon: {
        width: width * 0.05,
        height: height * 0.03,
        marginRight: width * 0.03,
    },
    statsText: {
        fontFamily: FONTS.poppins_font,
        fontSize: 16,
        color: COLORS.neutral_base_dark,
    },
});
