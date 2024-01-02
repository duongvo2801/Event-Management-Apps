import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  BackHandler,
} from 'react-native';

import DumyDataEvent from './events/DummyDataEvent';
import ItemListEvent from './events/ItemListEvent';
import { FilterBar, SearchBar } from '../components/common';
import { Padding, Color, FontSize, Border } from '../components/styles/GlobalStyles';

// EventHeader component
const EventHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.nameScreenAndBtnAdd}>
      <View style={styles.textFlexBox}>
        <Text style={styles.dashboard}>Sự kiện</Text>
        <Image style={styles.logoEvent} source={require('../assets/icon--event2.png')} />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('AddEvent')}>
        <Image style={styles.buttonFab} source={require('../assets/plus-icon.png')} />
      </TouchableOpacity>
    </View>
  );
};

const DoubleBackToExit = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (isBackPressedOnce()) {
          BackHandler.exitApp();
          return true;
        } else {
          showToast('Nhấn lần nữa để thoát');
          return true;
        }
      });

      return () => backHandler.remove();
    }, []),
  );

  let lastBackPressed = 0;

  const isBackPressedOnce = () => {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastBackPressed;
    lastBackPressed = currentTime;

    return timeDiff < 2000;
  };

  const showToast = message => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  return null;
};

// EventScreen component
const EventScreen = () => {
  const navigation = useNavigation();
  const [searchPhrase, setSearchPhrase] = useState('');
  const [clicked, setClicked] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');

  const listFilter = [
    { status: 'Tất cả' },
    { status: 'Sắp tới' },
    { status: 'Hoạt động' },
    { status: 'Hoàn thành' },
  ];

  const handleFilterChange = status => {
    setSelectedStatus(status);
  };

  return (
    <View style={styles.container}>
      <EventHeader />
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        clicked={clicked}
        setClicked={setClicked}
      />
      <FilterBar
        listTab={listFilter}
        selectedStatus={selectedStatus}
        onTabPress={handleFilterChange}
      />

      <FlatList
        data={DumyDataEvent}
        renderItem={({ item }) => <ItemListEvent data={item} />}
        keyExtractor={item => item.id}
        style={{ height: '100%', width: '100%' }}
        showsVerticalScrollIndicator={false}
      />
      <DoubleBackToExit navigation={navigation} />
    </View>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
  searchEvent: {
    height: 48,
    paddingVertical: 0,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Padding.p_5xl,
    borderRadius: Border.br_base,
    alignSelf: 'stretch',
    backgroundColor: Color.colorWhite,
    elevation: 10,
    shadowColor: Color.colorBlack,
    shadowOffset: { width: 0, height: 100 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  imageSearch: {
    height: 20,
    width: 20,
  },
  imageTune: {
    height: 20,
    width: 20,
    marginLeft: 16,
  },
  inputSearch: {
    marginLeft: 16,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerTabBar: {
    width: 313,
    height: 40,
    marginTop: 16,
  },
  tabBar: {
    left: 0,
    top: 0,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabAll: {
    paddingVertical: Padding.p_5xs,
    paddingHorizontal: Padding.p_base,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnTabAll: {
    fontWeight: '500',
    color: Color.neutral2,
    lineHeight: 24,
    fontSize: FontSize.headlines16Medium_size,
    textAlign: 'left',
  },
  tabBarCompleted: {
    backgroundColor: Color.colorBlueviolet,
    marginLeft: 16,
    borderRadius: Border.br_xs,
    paddingVertical: Padding.p_5xs,
    paddingHorizontal: Padding.p_base,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnCompleted: {
    textAlign: 'right',
    color: Color.colorWhite,
    lineHeight: 24,
    fontSize: FontSize.headlines16Medium_size,
    fontWeight: '700',
  },
  tabUncompleted: {
    paddingVertical: Padding.p_5xs,
    paddingHorizontal: Padding.p_base,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  btnUnCompleted: {
    fontWeight: '500',
    color: Color.neutral2,
    lineHeight: 24,
    fontSize: FontSize.headlines16Medium_size,
    textAlign: 'left',
  },
});
