/**
 * @file SplashScreenStyles.js
 * @description Includes styles for the splash screen.
 *
 * @datecreated 10.04.2025
 * @lastmodified 10.04.2025
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral_base_soft,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});
