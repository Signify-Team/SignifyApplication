/**
 * @file VideoDisplayStyles.js
 * @description Styling for the video display component.
 *
 * @datecreated 22.12.2024
 * @lastmodified 22.12.2024
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../utils/constants';
const { width, height } = Dimensions.get('window');


export default StyleSheet.create({
    container: {
      justifyContent: 'center',
      backgroundColor: 'black',
      borderRadius: 16,
      borderWidth: width * 0.025,
      borderColor: COLORS.primary,
    },
    dictionaryContainer: {
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 16,
      borderWidth: width * 0.025,
      borderColor: COLORS.primary,
      width: width * 0.94,
    },
    video: {
      width: width * 0.85,
      height: height * 0.27,
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
    },
    dictionaryVideo: {
      width: width * 0.89,
      height: height * 0.37,
      borderRadius: 16,
    },
});
