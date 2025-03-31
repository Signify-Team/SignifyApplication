/**
 * @file QuestionStyles.js
 * @description Includes styles for different question components.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import {
    StyleSheet,
    Dimensions,
} from 'react-native';
import {
    COLORS,
    FONTS,
} from '../utils/constants';

const {height, width} =
    Dimensions.get(
        'window',
    );

export default StyleSheet.create({
    quesContainer: {
        flex: 1,
        backgroundColor: COLORS.neutral_base_soft,
        padding: width * 0.03,
        justifyContent: 'center',
    },
    trueFalseContainer: {
        alignItems: 'center',
        marginBottom: height * 0.1,
    },
    multContainer: {
        width: '100%',
    },
    question: {
        fontSize: 24,
        marginBottom: height * 0.05,
        textAlign: 'center',
        paddingHorizontal: width * 0.1,
        color: COLORS.neutral_base_dark,
        fontFamily: FONTS.poppins_font,
    },
    optionsContainer: {
        marginVertical: height * 0.02,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: width * 0.05,
    },
    gestContainer: {
        width: '100%',
        alignItems: 'center',
    },
    prompt: {
        fontSize: 20,
        marginBottom: 20,
        color: COLORS.neutral_base_dark,
    },
    camera: {
        width: '100%',
        height: 400,
        borderRadius: 12,
        marginBottom: 20,
    },
});
