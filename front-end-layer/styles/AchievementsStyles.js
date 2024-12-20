/**
 * @file AchievementsStyles.js
 * @description Styles for the Achievements Page
 *
 * @datecreated 18.12.2024
 * @lastmodified 18.12.2024
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral_base_soft,
        paddingTop: height * 0.01,
        paddingHorizontal: width * 0.05,
    },
    sectionTitle: {
        fontFamily: FONTS.poppins_font,
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: height * 0.02,
        marginBottom: height * 0.01,
        color: COLORS.dark_accent,
    },
    rewardBox: {
        backgroundColor: COLORS.light_gray_2,
        borderRadius: 12,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    rewardItem: {
        alignItems: 'center',
    },
    rewardImage: {
        width: 50,
        height: 50,
    },
    activeReward: {
        borderColor: COLORS.highlight_color_2,
        borderWidth: 2,
        borderRadius: 12,
    },
    dayNumber: {
        fontFamily: FONTS.poppins_font,
        marginTop: 5,
        fontSize: 16,
        color: COLORS.neutral_base_dark,
    },
    activeDay: {
        color: COLORS.highlight_color_2,
        fontFamily: FONTS.poppins_font,
    },
    
    achievementContent: {
        fontFamily: FONTS.poppins_font,
        backgroundColor: COLORS.light_gray_2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    
    achievementCard: {
        backgroundColor: COLORS.light_gray_2,
        borderRadius: 12,
        padding: 15,
        marginVertical: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    achievementText: {
        fontFamily: FONTS.poppins_font,
        flex: 1,
    },
    cardTitle: {
        fontFamily: FONTS.poppins_font,
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.neutral_base_dark,
    },
    cardDescription: {
        fontFamily: FONTS.poppins_font,
        fontSize: 16,
        color: COLORS.dark_gray_1,
        marginTop: 5,
    },
    collectButton: {
        alignSelf: 'center',       
        marginTop: 10,             
        marginBottom: 10,          
    },
    collectImage: {
        width: 120,                
        height: 45,    
        marginTop: 10,             
        marginBottom: 10,                 
        resizeMode: 'contain',     
    },
    trophyImage: {
        width: 60,
        height: 70,
        marginLeft: 10,
        resizeMode: 'contain',
    },
});
