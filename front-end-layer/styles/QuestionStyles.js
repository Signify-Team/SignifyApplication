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
} from '../utils/constants';

const {width, height} =
    Dimensions.get(
        'window',
    );

export default StyleSheet.create({
    quesContainer: {
        flex: 1,
        backgroundColor: COLORS.neutral_base_soft,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    multContainer: {
        width: '100%',
    },
    question: {
        fontSize: 22,
        marginBottom: height * 0.01,
        textAlign: 'center',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
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
