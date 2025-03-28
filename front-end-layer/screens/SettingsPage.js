/**
 * @file SettingsPage.js
 * @description Includes settings and configurations for the application
 *
 * @datecreated 05.11.2024
 * @lastmodified 17.12.2024
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, Modal } from 'react-native';
import { COLORS } from '../utils/constants';
import styles from '../styles/SettingsStyles';
import { clearUserId } from '../utils/apiService';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../utils/constants';

const SettingsPage = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [isVibration, setIsVibration] = React.useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigation = useNavigation();

    const handleLogout = async () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
        try {
            await clearUserId();
            setShowLogoutModal(false);
            setTimeout(() => {
                navigation.replace('Welcome');
            }, 300);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Account Settings */}
                <Text style={styles.sectionTitle}>Account Settings:</Text>
                <View style={styles.settingCard}>
                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionText}>Change Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionText}>Language Selection</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Text style={[styles.optionText, { color: COLORS.button_color }]}>Delete Account</Text>
                    </TouchableOpacity>
                </View>

                {/* Notification Settings */}
                <Text style={styles.sectionTitle}>Notification Settings:</Text>
                <View style={styles.settingCard}>
                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionText}>Notifications</Text>
                        <Text style={styles.arrow}>{'>'}</Text>
                    </TouchableOpacity>
                </View>

                {/* App Preferences */}
                <Text style={styles.sectionTitle}>App Preferences:</Text>
                <View style={styles.settingCard}>
                    <View style={styles.option}>
                        <Text style={styles.optionText}>Dark Mode</Text>
                        <View style={styles.switchWrapper}>
                            <Switch
                                value={isDarkMode}
                                onValueChange={setIsDarkMode}
                                trackColor={{ true: COLORS.bright_button_color, false: COLORS.light_gray_2 }}
                                style={styles.switch}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionText}>Sound Effects</Text>
                        <Text style={styles.arrow}>{'>'}</Text>
                    </TouchableOpacity>
                    <View style={styles.option}>
                        <Text style={styles.optionText}>Vibration Feedback</Text>
                        <View style={styles.switchWrapper}>
                            <Switch
                                value={isVibration}
                                onValueChange={setIsVibration}
                                trackColor={{ true: COLORS.bright_button_color, false: COLORS.light_gray_2 }}
                                style={styles.switch}
                            />
                        </View>
                    </View>
                </View>

                {/* Privacy Settings */}
                <Text style={styles.sectionTitle}>Privacy Settings:</Text>
                <View style={styles.settingCard}>
                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionText}>Data Privacy</Text>
                        <Text style={styles.arrow}>{'>'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionText}>Consent Forms</Text>
                        <Text style={styles.arrow}>{'>'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <Text style={styles.footerText}>
                    App Version 1.1.1 | Terms and Conditions | Contact Support
                </Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={[styles.logoutText]}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Logout Confirmation Modal */}
            <Modal
                visible={showLogoutModal}
                transparent={true}
                animationType="fade"
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        backgroundColor: COLORS.soft_container_color,
                        borderRadius: 20,
                        padding: 20,
                        width: '80%',
                        shadowColor: COLORS.neutral_base_dark,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    }}>
                        <Text style={{
                            fontFamily: FONTS.baloo_font,
                            fontSize: 24,
                            color: COLORS.neutral_base_dark,
                            marginBottom: 15,
                            textAlign: 'center',
                        }}>
                            Logout
                        </Text>
                        <Text style={{
                            fontFamily: FONTS.poppins_font,
                            fontSize: 16,
                            color: COLORS.neutral_base_dark,
                            marginBottom: 20,
                            textAlign: 'center',
                        }}>
                            Are you sure you want to logout?
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: 10,
                        }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: COLORS.light_gray_2,
                                    padding: 15,
                                    borderRadius: 10,
                                    alignItems: 'center',
                                }}
                                onPress={() => setShowLogoutModal(false)}
                            >
                                <Text style={{
                                    fontFamily: FONTS.poppins_font,
                                    fontSize: 16,
                                    color: COLORS.neutral_base_dark,
                                }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    backgroundColor: COLORS.highlight_color_2,
                                    padding: 15,
                                    borderRadius: 10,
                                    alignItems: 'center',
                                }}
                                onPress={confirmLogout}
                            >
                                <Text style={{
                                    fontFamily: FONTS.poppins_font,
                                    fontSize: 16,
                                    color: COLORS.white,
                                }}>
                                    Logout
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SettingsPage;
