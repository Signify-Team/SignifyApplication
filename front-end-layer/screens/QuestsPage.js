/**
 * @file QuestsPage.js
 * @description Contains the quests of the user.
 *
 * @datecreated 17.12.2024
 * @lastmodified 17.12.2024
 */

import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import styles from '../styles/QuestsCardStyle.js';
import QuestsCard from '../components/QuestsCard';

const QuestsPage = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>Daily quests</Text>

        <QuestsCard
          title="Finish this quest"
          timeRemaining="6 hours"
          progress={0}
          total={1}
          isTimeLimited={true}
        />

        <QuestsCard
          title="Finish this quest"
          timeRemaining="6 hours"
          progress={0}
          total={1}
          isTimeLimited={true}
        />

        <Text style={styles.subHeader}>Quests between friends:</Text>

        <QuestsCard
          title="Finish this quest"
          progress={1}
          total={1}
          isCompleted={true}
        />

        <QuestsCard
          title="Finish this quest"
          timeRemaining="10 days"
          progress={0}
          total={1}
        />
      </ScrollView>
    </View>
  );
};

export default QuestsPage;
