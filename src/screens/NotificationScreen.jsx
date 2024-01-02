import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import { Border, Color, FontSize, Padding } from '../components/styles/GlobalStyles';
import DummyDataNotification from './notifications/DummyDataNotification';
import ListNotification from './notifications/ListNotification';

const ToolbarEmployee = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.nameScreenAndBtnAdd}>
      <View style={styles.textFlexBox}>
        <Text style={styles.dashboard}>Thông báo</Text>
        <Image style={styles.logoEvent} source={require('../assets/notifications.png')} />
      </View>
    </View>
  );
};

const NotificationScreen = () => {
  const [clicked, setClicked] = useState(false);
  const [fakeData, setFakeData] = useState([]);

  useEffect(() => {
    setFakeData(DummyDataNotification);
  }, []);

  return (
    <View style={styles.container}>
      <ToolbarEmployee />

      <ListNotification data={fakeData} setClicked={setClicked} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 812,
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
    alignItems: 'center',
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  nameScreenAndBtnAdd: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  textFlexBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dashboard: {
    fontSize: FontSize.title24Bold_size,
    lineHeight: 29,
    textAlign: 'left',
    color: Color.colorMidnightblue,
    fontWeight: '700',
  },
  logoEvent: {
    marginLeft: 8,
    height: 24,
    width: 24,
  },
  buttonFab: {
    width: 44,
    height: 44,
    overflow: 'hidden',
    borderRadius: Border.br_xs,
    backgroundColor: Color.colorBlueviolet,
  },
  title: {
    width: '100%',
    marginTop: 20,
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: '10%',
  },
});

export default NotificationScreen;
