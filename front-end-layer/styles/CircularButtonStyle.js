/**
 * @file CircularButtonStyle.js
 * @description Includes styles for the circular button component.
 *
 * @datecreated 19.12.2024
 * @lastmodified 19.12.2024
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../utils/constants';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    outerWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: height * 0.015,
    },
    outerWrapperPressed: {
        backgroundColor: 'transparent',
        paddingBottom: height * 0.01,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: COLORS.button_underline,
    },
    buttonPressed: {
        top: 5,
        borderBottomWidth: 0,
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    icon: {
        width: width * 0.2,
        height: height * 0.2,
        resizeMode: 'contain',
    },
});
