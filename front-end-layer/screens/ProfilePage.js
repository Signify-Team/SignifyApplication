/**
 * @file ProfilePage.js
 * @description Profile page including user information, preferences, changeable information.
 *              Includes a settings button for the user to change their preferences.
 *
 * @datecreated 05.11.2024
 * @lastmodified 19.12.2024
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
import RectangularButton from '../components/RectangularButton.js';
import { SIZES, COLORS } from '../utils/constants.js';

const {height} =
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
                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                        <RectangularButton
                            width={295}
                            text="ADD FRIENDS"
                            color={COLORS.bright_button_color}
                            onPress={() => console.log('Add Friends button pressed')}
                        />

                        <RectangularButton
                            width={50}
                            icon={require('../assets/icons/header/share.png')}
                            onlyIcon={true}
                            color={COLORS.bright_button_color}
                            onPress={() => console.log('Icon button pressed')}
                        />
                    </View>
                    {/* Statistics */}
                    <Text style={styles.header}>Statistics</Text>
                    <View style={styles.row}>
                        <StatsCard
                            height={height * SIZES.statsContainer}
                            width={'49%'}
                            icon={FireIcon}
                            text="Streak Count"
                        />
                        <StatsCard
                            height={height * SIZES.statsContainer}
                            width={'49%'}
                            text="Total Points"
                            showIcon={false}
                        />
                    </View>
                    <View style={styles.row}>
                        <StatsCard
                            height={height * SIZES.statsContainer}
                            width={'49%'}
                            text="Progress"
                            showIcon={false}
                        />
                        <StatsCard
                            height={height * SIZES.statsContainer}
                            width={'49%'}
                            showIcon={false}
                            showText={false}
                        />
                    </View>

                    {/* Badges */}
                    <Text style={styles.header}>Badges</Text>
                    <View style={styles.row}>
                        <StatsCard
                            height={height * SIZES.badgesContainer}
                            width={'22%'}
                            showIcon={false}
                            showText={false}
                        />
                        <StatsCard
                            height={height * SIZES.badgesContainer}
                            width={'22%'}
                            showIcon={false}
                            showText={false}
                        />
                        <StatsCard
                            height={height * SIZES.badgesContainer}
                            width={'22%'}
                            showIcon={false}
                            showText={false}
                        />
                        <StatsCard
                            height={height * SIZES.badgesContainer}
                            width={'22%'}
                            showIcon={false}
                            showText={false}
                        />
                    </View>
                    <View style={styles.row}>
                        <StatsCard
                            height={height * SIZES.badgesContainer}
                            width={'22%'}
                            showIcon={false}
                            showText={false}
                        />
                        <StatsCard
                            height={height * SIZES.badgesContainer}
                            width={'22%'}
                            showIcon={false}
                            showText={false}
                        />
                        <StatsCard
                            height={height * SIZES.badgesContainer}
                            width={'22%'}
                            showIcon={false}
                            showText={false}
                        />
                        <StatsCard
                            height={height * SIZES.badgesContainer}
                            width={'22%'}
                            showIcon={false}
                            showText={false}
                        />
                    </View>
                </ScrollView>
            </View>
            </>
        );
    };

export default ProfilePage;
