/**
 * @file ProfileCardStyle.js
 * @description Includes styles for the profile card on the profile page.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, hexToRgba } from '../utils/constants';

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
        paddingVertical: height * 0.01,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: COLORS.soft_container_color,
        borderRadius: 16,
        width: width * 0.9,
        height: height * 0.2,
        marginTop: height * 0.01,
        marginBottom: height * 0.03,
        elevation: 3,
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    header: {
        fontSize: 30,
        color: COLORS.neutral_base_dark,
        marginBottom: height * 0.01,
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
        fontSize: 16,
        color: COLORS.neutral_base_dark,
    },
});
