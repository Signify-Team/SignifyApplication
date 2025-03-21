/**
 * @file RectangularButtonStyle.js
 * @description Includes styles for the rectangular button component.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS} from '../utils/constants';

const {width, height} =
    Dimensions.get(
        'window',
    );

export default StyleSheet.create({
    outerWrapper: {
        borderRadius: 10,
        paddingBottom: height * 0.008,
        alignItems: 'center',
    },
    outerWrapperPressed: {
        backgroundColor: 'transparent',
        paddingBottom: height * 0.01,
    },
    button: {
        borderRadius: 10,
        paddingVertical: height * 0.008,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10,
        borderBottomWidth: 2,
        borderColor: COLORS.button_underline,
    },
    buttonPressed: {
        top: 8,
        borderRadius: 10,
        borderBottomWidth: 0,
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: FONTS.game_button_font,
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    icon: {
        width: width * 0.05,
        height: height * 0.03,
    },
});
