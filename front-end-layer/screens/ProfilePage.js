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
import { SIZES, COLORS } from '../utils/constants.js';

// Components
import ProfileTopBar from '../components/ProfileTopBar';
import ProfileCard from '../components/ProfileCard';
import StatsCard from '../components/StatsCard.js';
import RectangularButton from '../components/RectangularButton.js';
import InfoBox from '../components/InfoBox.js';
import KoalaHand from '../assets/icons/header/koala-hand.png';
import TurkishFlag from '../assets/icons/header/turkish-flag.png';
import FireIcon from '../assets/icons/header/streak.png';

const {height} =
    Dimensions.get(
        'window',
    );

const ProfilePage =
    () => {
        return (
            <>
            {/* Profile Top Bar */}
            <ProfileTopBar />
            {/* Main content */}
            <View style={styles.container}>
                <ScrollView>
                    <ProfileCard
                        profilePic={KoalaHand}
                        username="username"
                        handle="@username"
                        memberSince="2024"
                    />

                    {/* Info Bar */}
                    <View style={styles.infoRow}>
                        <InfoBox
                            icon={TurkishFlag}
                            value=""
                            label="Course"
                        />
                        <View style={styles.divider} />
                        <InfoBox
                            value="12"
                            label="Followers"
                        />
                        <View style={styles.divider} />
                        <InfoBox
                            value="12"
                            label="Following"
                        />
                    </View>

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
