/**
 * @file ProfilePage.js
 * @description Profile page including user information, preferences, changeable information.
 *              Includes a settings button for the user to change their preferences.
 *
 * @datecreated 05.11.2024
 * @lastmodified 07.11.2024
 */

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Dimensions,
} from 'react-native';
import styles from '../styles/ProfileCardStyle.js';
import ProfileTopBar from '../components/ProfileTopBar';
import ProfileCard from '../components/ProfileCard';
import StatsCard from '../components/StatsCard.js';
import FireIcon from '../assets/icons/header/streak.png';
import { COLORS} from '../utils/constants';

const {width, height} =
    Dimensions.get(
        'window',
    );

const ProfilePage =
    () => {
        return (
            <>
            {/* Custom Top Bar */}
            <ProfileTopBar />
            {/* Main content */}
            <View style={styles.container}>
                <ScrollView>
                    <ProfileCard  username="profile card"/>
                    <Text style={styles.header}>Info Box</Text>
                    <Text style={styles.header}>Add friends</Text>

                    {/* Statistics */}
                    <Text style={styles.header}>Statistics</Text>
                    <View style={styles.row}>
                        <StatsCard
                            height={height * 0.09}
                            width={'49%'}
                            icon={FireIcon}
                            text="Streak Count"
                        />
                        <StatsCard
                            height={height * 0.09}
                            width={'49%'}
                            text="Total Points"
                            showIcon={false}
                        />
                    </View>
                    <View style={styles.row}>
                        <StatsCard
                            height={height * 0.09}
                            width={'49%'}
                            text="Progress"
                            showIcon={false}
                        />
                        <StatsCard
                            height={height * 0.09}
                            width={'49%'}
                            showIcon={false}
                            showText={false}
                        />
                    </View>

                    {/* Badges */}
                    <Text style={styles.header}>Badges</Text>
                </ScrollView>
            </View>
            </>
        );
    };

export default ProfilePage;
