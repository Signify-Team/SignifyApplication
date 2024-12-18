/**
 * @file ProfileCardStyle.js
 * @description Includes styles for the profile card on the profile page.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS} from '../utils/constants';

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
        marginTop: height * 0.02,
        marginBottom: height * 0.01,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width * 0.9,
        marginBottom: height * 0.01,
    },
});
