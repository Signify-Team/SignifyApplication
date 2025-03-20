/**
 * @file LanguageDropdown.js
 * @description A dropdown component for language selection with a cute UI.
 *
 * @datecreated 23.12.2024
 * @lastmodified 23.12.2024
 */

import React from 'react';
import { View, TouchableOpacity, Image, Modal, StyleSheet, Animated, Text } from 'react-native';
import { COLORS } from '../utils/constants';
import TurkishFlagIcon from '../assets/icons/header/turkish-flag.png';
import AmericanFlagIcon from '../assets/icons/header/american-flag.png';

const LanguageDropdown = ({ visible, onClose, currentLanguage, onLanguageSelect }) => {
    const languages = [
        { id: 'TID', name: 'Turkish Sign Language', flag: TurkishFlagIcon },
        { id: 'ASL', name: 'American Sign Language', flag: AmericanFlagIcon },
    ];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity 
                style={styles.modalOverlay} 
                activeOpacity={1} 
                onPress={onClose}
            >
                <View style={styles.dropdownContainer}>
                    {languages.map((lang) => (
                        <TouchableOpacity
                            key={lang.id}
                            style={[
                                styles.languageOption,
                                currentLanguage === lang.id && styles.selectedOption
                            ]}
                            onPress={() => {
                                onLanguageSelect(lang.id);
                                onClose();
                            }}
                        >
                            <Image source={lang.flag} style={styles.flagIcon} />
                            <View style={styles.languageInfo}>
                                <Text style={styles.languageName}>{lang.name}</Text>
                                <Text style={styles.languageCode}>{lang.id}</Text>
                            </View>
                            {currentLanguage === lang.id && (
                                <View style={styles.checkmark}>
                                    <Text style={styles.checkmarkText}>✓</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        paddingTop: 60,
    },
    dropdownContainer: {
        backgroundColor: COLORS.white,
        marginHorizontal: 20,
        borderRadius: 15,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginVertical: 5,
    },
    selectedOption: {
        backgroundColor: COLORS.soft_pink_background,
    },
    flagIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15,
    },
    languageInfo: {
        flex: 1,
    },
    languageName: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: COLORS.neutral_base_dark,
    },
    languageCode: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: COLORS.dark_gray_1,
    },
    checkmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LanguageDropdown; 