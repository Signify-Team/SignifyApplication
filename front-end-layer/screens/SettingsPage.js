/**
 * @file SettingsPage.js
 * @description Includes settings and configurations for the application
 *
 * @datecreated 05.11.2024
 * @lastmodified 31.03.2025
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { COLORS } from '../utils/constants';
import styles from '../styles/SettingsStyles';
import { clearUserId, deleteAccount } from '../utils/apiService';
import { useNavigation } from '@react-navigation/native';
import DeleteAccountModal from '../components/DeleteAccountModal';
import LogoutModal from '../components/LogoutModal';

const SettingsPage = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isVibration, setIsVibration] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleLogout = () => {
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

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteAccount = async () => {
        setIsLoading(true);
        try {
            await deleteAccount();
            setShowDeleteModal(false);
            setTimeout(() => {
                navigation.replace('Welcome');
            }, 300);
        } catch (error) {
            console.error('Error deleting account:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: 50 }]}>
            <ScrollView>
                {/* Account Settings */}
                <Text style={styles.sectionTitle}>Account Settings:</Text>
                <View style={styles.settingCard}>
                    <TouchableOpacity 
                        style={styles.option}
                        onPress={() => navigation.navigate('ChangePassword')}>
                        <Text style={styles.optionText}>Change Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.option}
                        onPress={() => navigation.navigate('LanguagePreference')}>
                        <Text style={styles.optionText}>Language Selection</Text>
                        <Text style={styles.arrow}>{'>'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.option, { borderBottomWidth: 0 }]}
                        onPress={handleDeleteAccount}>
                        <Text style={[styles.optionText, { color: COLORS.button_color }]}>Delete Account</Text>
                    </TouchableOpacity>
                </View>

                {/* Notification Settings */}
                <Text style={styles.sectionTitle}>Notification Settings:</Text>
                <View style={styles.settingCard}>
                    <TouchableOpacity style={[styles.option, { borderBottomWidth: 0 }]}>
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
                    <View style={[styles.option, { borderBottomWidth: 0 }]}>
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
                    <TouchableOpacity style={[styles.option, { borderBottomWidth: 0 }]}>
                        <Text style={styles.optionText}>Consent Forms</Text>
                        <Text style={styles.arrow}>{'>'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <Text style={styles.footerText}>
                    App Version 1.1.1 | Terms and Conditions | Contact Support
                </Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logoutText}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Modals */}
            <LogoutModal 
                visible={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
            />
            <DeleteAccountModal 
                visible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDeleteAccount}
                isLoading={isLoading}
            />
        </View>
    );
};

export default SettingsPage;
