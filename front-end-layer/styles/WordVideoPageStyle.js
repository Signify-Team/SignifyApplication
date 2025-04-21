/**
 * @file WordVideoPageStyle.js
 * @description Styles specific to the WordVideoPage screen.
 *
 * @datecreated 21.04.2025
 * @lastmodified 21.04.2025
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral_base_soft,
  },
  topBar: {
    paddingTop: height * 0.07,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.005,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.neutral_base_dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1,
  },
  backIcon: {
    width: width * 0.08,
    height: width * 0.08,
    tintColor: COLORS.neutral_base_dark,
  },
  titleBar: {
    alignItems: 'center',
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
  },
  pageTitle: {
    fontSize: width * 0.065,
    fontFamily: FONTS.poppins_font,
    color: COLORS.neutral_base_dark,
    fontWeight: 'bold',
  },
  descriptionWrapper: {
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.08,
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: width * 0.042,
    fontFamily: FONTS.poppins_font,
    color: COLORS.dark_gray_1,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default styles;
