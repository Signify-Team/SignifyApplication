/**
 * @file soundServices.js
 * @description Sound related services
 * @datecreated 02.05.2025
 * @lastmodified 02.05.2025
 */

import Sound from 'react-native-sound';

Sound.setCategory('Playback', true);

let primaryButtonSound;
let backMenuSound;
let coursePopUpSound;

export const loadSounds = () => {
    primaryButtonSound = new Sound('primary_button_sound.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
        console.error('Failed to load sound:', error);
        } else {
        console.log('Primary button sound loaded');
        }
    });
    backMenuSound = new Sound('menu_back_sound.wav', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
        console.error('Failed to load sound:', error);
        } else {
        console.log('Back menu sound loaded');
        }
    });
    coursePopUpSound = new Sound('course_pop_up.wav', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
        console.error('Failed to load sound:', error);
        } else {
        console.log('Course pop-up sound loaded');
        }
    });
};

export const playPrimaryButtonSound = () => {
    if (primaryButtonSound && primaryButtonSound.isLoaded()) {
      primaryButtonSound.stop();
      primaryButtonSound.setCurrentTime(0);
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

export const playBackMenuSound = () => {
    if (backMenuSound && backMenuSound.isLoaded()) {
      backMenuSound.stop();
      backMenuSound.setCurrentTime(0);
      backMenuSound.setVolume(1.0);
      backMenuSound.play((success) => {
        if (success) {
          console.log('✅ Played menu_back_sound.wav');
        } else {
          console.warn('⚠️ Failed to play menu_back_sound.wav');
        }
      });
    } else {
      console.warn('❌ backMenuSound is not loaded or undefined');
      loadSounds();
    }
};

export const playCoursePopUpSound = () => {
    if (coursePopUpSound && coursePopUpSound.isLoaded()) {
      coursePopUpSound.stop();
      coursePopUpSound.setCurrentTime(0);
      coursePopUpSound.setVolume(1.0);
      coursePopUpSound.play((success) => {
        if (success) {
          console.log('✅ Played course_popup_sound.mp3');
        } else {
          console.warn('⚠️ Failed to play course_popup_sound.mp3');
        }
      });
    } else {
      console.warn('❌ coursePopUpSound is not loaded or undefined');
      loadSounds();
    }
};
