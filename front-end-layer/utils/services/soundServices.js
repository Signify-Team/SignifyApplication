/**
 * @file soundServices.js
 * @description Sound related services
 * @datecreated 02.05.2025
 * @lastmodified 02.05.2025
 */

import Sound from 'react-native-sound';

Sound.setCategory('Playback', true);

let primaryButtonSound;

export const loadSounds = () => {
  primaryButtonSound = new Sound('primary_button_sound.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.error('Failed to load sound:', error);
    } else {
      console.log('Primary button sound loaded');
    }
  });
};

export const playPrimaryButtonSound = () => {
    console.log('🟡 Called playPrimaryButtonSound()');

    if (primaryButtonSound && primaryButtonSound.isLoaded()) {
      primaryButtonSound.setVolume(1.0);
      primaryButtonSound.play((success) => {
        if (success) {
          console.log('✅ Played primary_button_sound.mp3');
        } else {
          console.warn('⚠️ Failed to play primary_button_sound.mp3');
        }
      });
    } else {
      console.warn('❌ primaryButtonSound is not loaded or undefined');
    loadSounds();
    }
  };
