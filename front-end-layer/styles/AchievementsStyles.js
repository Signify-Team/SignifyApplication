/**
 * @file AchievementsStyles.js
 * @description Styles for the Achievements page.
 *
 * @datecreated 20.12.2024
 * @lastmodified 20.12.2024
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral_base_soft,
        padding: height * 0.02,
        paddingTop: height * 0.08,
    },
    cardContainer: {
        backgroundColor: COLORS.soft_container_color,
        borderRadius: 20,
        paddingVertical: height * 0.025,
        paddingHorizontal: width * 0.05,
        marginBottom: height * 0.02,
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
    },
    sectionTitle: {
        fontSize: 30,
        fontFamily: FONTS.poppins_font,
        color: COLORS.neutral_base_dark,
        textAlign: 'center',
        marginBottom: height * 0.018,
    },
    rewardBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: COLORS.neutral_base_dark,
        borderRadius: 15,
        backgroundColor: COLORS.neutral_base_soft,
        minHeight: 100,
    },
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    rewardLeft: {
        flex: 1,
    },
    rewardRight: {
        marginLeft: 20,
    },
    rewardImageContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.soft_pink_background,
        borderRadius: 20,
        padding: 10,
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    rewardImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    rewardImageDisabled: {
        opacity: 0.4,
    },
    rewardInfo: {
        flex: 1,
    },
    rewardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 8,
    },
    rewardSubtitle: {
        fontSize: 16,
        color: COLORS.neutral_base_dark,
        lineHeight: 22,
    },
    rewardButtonContainer: {
        minWidth: 100,
    },
    rewardButton: {
        backgroundColor: COLORS.secondary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.neutral_base_dark,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    rewardButtonDisabled: {
        backgroundColor: COLORS.gray,
    },
    rewardButtonText: {
        color: COLORS.soft_pink_background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingText: {
        fontFamily: FONTS.poppins_font,
        fontSize: 16,
        color: COLORS.neutral_base_dark,
        textAlign: 'center',
        marginVertical: height * 0.02,
    },
    errorText: {
        fontFamily: FONTS.poppins_font,
        fontSize: 16,
        color: COLORS.highlight_color_2,
        textAlign: 'center',
        marginVertical: height * 0.02,
    },
});
