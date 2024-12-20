/**
 * @file AnswerCardStyles.js
 * @description Includes styles of the answer card.
 *
 * @datecreated 20.12.2024
 * @lastmodified 20.12.2024
 */

import { COLORS } from '../utils/constants';
import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    card: {
        width: width * 0.4,
        height: height * 0.12,
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
    },
    text: {
        fontSize: 20,
        fontFamily: 'poppins',
        color: COLORS.neutral_base_dark,
    },
});