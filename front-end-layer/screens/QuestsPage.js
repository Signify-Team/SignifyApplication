/**
 * @file QuestsPage.js
 * @description Contains the quests of the user.
 *
 * @datecreated 17.12.2024
 * @lastmodified 17.12.2024
 */

import React, { useState } from 'react';
import { View, ScrollView, Text, Modal } from 'react-native';
import styles from '../styles/QuestsCardStyle.js';
import QuestsCard from '../components/QuestsCard';

const QuestsPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <ScrollView >
        <Text style={styles.header}>Daily quests</Text>

        <QuestsCard
          title="Finish this quest"
          timeRemaining="6 hours"
          progress={2}
          total={2}
          isDailyQuest={true}
        />

        <QuestsCard
          title="Finish this quest"
          timeRemaining="6 hours"
          progress={0}
          total={1}
          isDailyQuest={true}
        />

        <Text style={styles.header}>Quests between friends:</Text>

        <QuestsCard
          title="Finish this quest"
          progress={1}
          total={1}
          onCompletePress={() => console.log('Complete pressed')}
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
