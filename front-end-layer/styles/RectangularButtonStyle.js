/**
 * @file RectangularButtonStyle.js
 * @description Includes styles for the rectangular button component.
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
    outerWrapper: {
        borderRadius: 12,
        paddingBottom: height * 0.008,
        alignItems: 'center',
    },
    outerWrapperPressed: {
        backgroundColor: 'transparent',
        paddingBottom: height * 0.01,
    },
    button: {
        borderRadius: 12,
        paddingVertical: height * 0.008,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomStartRadius: 6,
        borderBottomEndRadius: 6,
        borderBottomWidth: 2,
        borderColor: COLORS.button_underline,
    },
    buttonPressed: {
        borderRadius: 6,
        borderBottomWidth: 0,
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    icon: {
        width: width * 0.05,
        height: height * 0.03,
    },
});
