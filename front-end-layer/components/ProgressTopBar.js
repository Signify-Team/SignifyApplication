import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { COLORS } from '../utils/constants';
import HeartIcon from '../assets/icons/header/heart.png';
import { playBackMenuSound } from '../utils/services/soundServices';

const ProgressTopBar = ({ navigation, currentProgress = 0, onBackPress, lives = 5 }) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          playBackMenuSound();
          handleBackPress;}}
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(Math.max(currentProgress, 0), 100)}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.livesContainer}>
        <Image source={HeartIcon} style={styles.heartIcon} />
        <Text style={styles.livesText}>{lives}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 46,
    paddingBottom: 12,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: 0,
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  backText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressContainer: {
    flex: 1,
    paddingRight: 8,
  },
  progressBackground: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.lemonade,
  },
  livesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  heartIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  livesText: {
    marginLeft: 3,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ProgressTopBar;
