/**
 * @file CourseDetailsTopBarStyles.js
 * @description Styles for the course details top bar.
 *
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import {
    StyleSheet,
    Dimensions,
    Platform,
    StatusBar,
} from 'react-native';
import {
    COLORS,
} from '../utils/constants';

const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

export default StyleSheet.create({
    container: {
        width: '100%',
        height: height * 0.08,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        paddingTop: STATUSBAR_HEIGHT,
        marginBottom: height * 0.02,
    },
    backIcon: {
        width: width * 0.06,
        height: width * 0.06,
        tintColor: COLORS.neutral_base_soft,
    },
}); 