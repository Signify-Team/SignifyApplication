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

const styles = StyleSheet.create({
    container: {
      width: '100%',
      aspectRatio: 16/9,
      backgroundColor: COLORS.background_secondary,
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 10,
      maxHeight: 200,
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
      width: '100%',
      height: '100%',
    },
    dictionaryVideo: {
      width: width * 0.89,
      height: height * 0.37,
      borderRadius: 16,
    },
    koalaHandContainer: {
      width: width * 0.89,
      height: height * 0.37,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.background_secondary,
      borderRadius: 16,
    },
    koalaHand: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
      marginBottom: 10,
    },
    messageText: {
      color: COLORS.primary,
      fontSize: 16,
      textAlign: 'center',
      paddingHorizontal: 20,
      marginTop: 10,
    },
});

export default styles;
