import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import Icon from '../../components/common/Icon';
import { Color } from '../../components/styles/GlobalStyles';
import { axiosAuthGet } from '../../configs/axiosInstance';
import { accessTokenKey } from '../../constants/constant';

const DetailProfileScreen = () => {
  const navigation = useNavigation();
  const [permissions, setPermissions] = useState();
  const [image, setImage] = useState(null);
  const [data, setData] = useState({});
  // const [checkData, setCheckData] = useState({});
  const [isModalIndicator, setIsModalIndicator] = useState(true);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchData();
  //   }, 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [checkData]);

  // const fetchData = async () => {
  //   const accessToken = await AsyncStorage.getItem(accessTokenKey);
  //   const respone = await axiosAuthGet('/employee/get-employee-profile', accessToken);
  //   if (respone) {
  //     setIsModalIndicator(false);
  //   }

  //   if (checkData !== respone) {
  //     setCheckData(respone);
  //     const employee = respone.employee;
  //     const dateString = employee.dateOfBirth;
  //     const formattedDate = format(new Date(dateString), 'dd/MM/yyyy');
  //     const gender = employee.gender === 'male' ? 'Nam' : 'Nữ';
  //     setData({
  //       name: employee.fullName,
  //       role: employee.auth.role.name,
  //       contract: employee.contract,
  //       birthDay: formattedDate,
  //       gender,
  //       phone: employee.phoneNumber,
  //       adress: employee.address,
  //       email: employee.email,
  //       avatar: employee.avatar,
  //     });
  //   }
  // };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.btn}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image source={require('../../assets/icon--backward3x.png')} style={styles.btnBack} />
          </TouchableOpacity>
          <View style={styles.btnHandle}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfileScreen')}
              style={[styles.btnDelEdit, styles.btnEdit]}>
              <Image
                source={require('../../assets/icons/Edit.png')}
                style={{ tintColor: 'white' }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* {isModalIndicator ? (
          <ActivityIndicator size={48} color={Color.primary} style={styles.activityIndicator} />
        ) : ( */}
        <View>
          <View style={{ flexDirection: 'column' }}>
            <View style={styles.containerAvatar}>
              <Image
                source={
                  data.avatar ? { uri: data.avatar } : require('../../assets/icons/AddAvatar.jpeg')
                }
                style={styles.avatar}
              />
            </View>
            <View style={styles.containerTextName}>
              <Text style={styles.textName}>name</Text>
            </View>
            <View style={styles.containerTextName}>
              <Text style={styles.textName}>role</Text>
            </View>
          </View>
          <View style={styles.cotainerInformation}>
            <View style={styles.containerLabel}>
              <View style={styles.labelProfile}>
                <Text style={styles.textLabel}>Ngày sinh</Text>
              </View>
              <View style={styles.labelProfile}>
                <Text style={styles.textLabel}>Giới tính</Text>
              </View>
              <View style={styles.labelProfile}>
                <Text style={styles.textLabel}>Số điện thoại</Text>
              </View>
              <View style={styles.labelProfile}>
                <Text style={styles.textLabel}>Địa chỉ</Text>
              </View>
              <View style={styles.labelProfile}>
                <Text style={styles.textLabel}>Email</Text>
              </View>
            </View>

            {/* -------------------data----------------  */}

            <View style={styles.containerData}>
              <View style={styles.dataProfile}>
                <Text style={styles.textData}>birthDay</Text>
              </View>
              <View style={styles.dataProfile}>
                <Text style={styles.textData}>gender</Text>
              </View>
              <View style={styles.dataProfile}>
                <Text style={styles.textData}>phone</Text>
              </View>
              <View style={styles.dataProfile}>
                <Text style={styles.textData}>adress</Text>
              </View>
              <View style={styles.dataProfile}>
                <Text style={[styles.textData]}>email</Text>
              </View>
            </View>
          </View>
          <View style={styles.dash} />
          <View style={styles.option}>
            <TouchableOpacity
              style={styles.setting}
              onPress={() => navigation.navigate('ChangePassword')}>
              <Icon
                source={require('../../assets/icons/Lock.png')}
                color={Color.primary}
                size="big"
              />
              <Text style={styles.textSetting}>Đổi mật khẩu</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* )} */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  btn: {
    flexDirection: 'row',
    width: '100%',
  },
  btnBack: {
    width: 40,
    height: 40,
    padding: 10,
  },
  btnHandle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btnDelEdit: {
    width: 40,
    height: 40,
    borderRadius: 12,
    padding: 8,
  },
  btnDel: {
    backgroundColor: Color.semanticRed,
    marginRight: 8,
  },
  btnEdit: {
    backgroundColor: Color.primary,
  },
  containerAvatar: {
    height: 'auto',
    alignItems: 'center',
    padding: 8,
    justifyContent: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 90,
  },
  cotainerInformation: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  containerLabel: {
    height: 'auto',
    width: 142,
  },
  dash: {
    height: 1,
    backgroundColor: '#A29EB6',
  },
  containerData: {
    width: 172,
    height: 'auto',
    marginLeft: 16,
  },
  activityIndicator: {
    justifyContent: 'center',
    marginTop: '80%',
    flex: 1,
  },
  setting: {
    marginTop: 16,
    flexDirection: 'row',
  },
  textSetting: {
    fontSize: 18,
    marginLeft: 8,
    fontWeight: '700',
    color: Color.primary,
  },
  containerTextName: {
    width: '100%',
    marginBottom: 20,
    justifyContent: 'center',
  },
  textName: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  labelProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: -4,
    justifyContent: 'flex-end',
    // backgroundColor: Color.overlayRed,
  },
  textLabel: {
    color: '#A29EB6',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 8,
    lineHeight: 24,
  },
  dataProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: -4,
    // backgroundColor: Color.overlayRed,
  },
  textData: {
    color: '#1C1243',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    lineHeight: 24,
  },
});

export default DetailProfileScreen;
