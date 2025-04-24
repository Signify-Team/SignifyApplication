/**
 * @file DictionaryPageStyle.js
 * @description Styles specific to the DictionaryPageStyle screen.
 *
 * @datecreated 24.04.2025
 * @lastmodified 24.04.2025
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: height * 0.07,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: width * 0.04,
        paddingBottom: height * 0.015,
    },
    backIcon: {
        width: width * 0.08,
        height: width * 0.08,
        tintColor: COLORS.neutral_base_dark,
    },
    pageTitle: {
        fontSize: width * 0.065,
        fontFamily: FONTS.poppins_font,
        color: COLORS.neutral_base_dark,
        marginLeft: width * 0.03,
        fontWeight: 'bold',
    },
    wordList: {
        paddingHorizontal: width * 0.04,
        paddingTop: height * 0.015,
    },
    wordCard: {
        backgroundColor: COLORS.soft_pink_background,
        borderRadius: 12,
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.04,
        marginBottom: height * 0.015,
        elevation: 2,
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    wordText: {
        fontSize: width * 0.045,
        fontFamily: FONTS.poppins_font,
        color: COLORS.neutral_base_dark,
    },
});

export default styles;
