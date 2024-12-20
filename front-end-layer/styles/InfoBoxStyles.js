/**
 * @file InfoBoxStyle.js
 * @description Includes styles for the info box component.
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

const {width, height} =
    Dimensions.get(
        'window',
    );

export default StyleSheet.create({
    infoBox: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    icon: {
        width: width * 0.17,
        height: height * 0.035,
        marginBottom: height * 0.005,
    },
    value: {
        fontSize: 26,
        color: COLORS.neutral_base_dark,
    },
    label: {
        fontSize: 13,
        fontFamily: FONTS.poppins_font,
        color: COLORS.neutral_base_dark,
    },
});
