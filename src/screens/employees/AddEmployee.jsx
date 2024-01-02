import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, ToastAndroid } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { CustomInput } from '../../components/common';
import { Color, Padding } from '../../components/styles/GlobalStyles';
import { axiosPut } from '../../configs';
import { accessTokenKey } from '../../constants/constant';
import { AppContext } from '../../contexts';

const list = [
  { label: 'Nam', value: 'Nam' },
  { label: 'Nữ', value: 'Nữ' },
];

const AddEmployee = ({ route }) => {
  const { email } = route.params;
  const navigation = useNavigation();
  const [isFocus, setIsFocus] = useState(false);
  const [clientValue, setClientValue] = useState('Nam');
  const [errors, setErrors] = useState({});
  const [listClients, setListClients] = useState([]);
  const { setIsLogin } = useContext(AppContext);
  const { isFirstLogin, setIsFirstLogin } = useContext(AppContext);
  const [inputs, setInputs] = useState({
    name: '',
    phone: '',
  });

  const handleErrors = (errorMessage, input) => {
    setErrors(prevState => ({ ...prevState, [input]: errorMessage }));
  };
  const handleOnChange = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };
  const createEmployee = async () => {
    if (!inputs.name) {
      handleErrors('Vui lòng nhập tên', 'name');
    }

    if (!inputs.phone) {
      handleErrors('Vui lòng nhập số điện thoại', 'phone');
    } else if (inputs.phone.length < 10) {
      handleErrors('Số điện thoại phải 10 số', 'phone');
    }

    if (inputs.name && inputs.phone) {
      const email = await AsyncStorage.getItem(accessTokenKey);
      const dataEmployee = await axiosPut('/employee/get-employee-list', {
        email,
        username: inputs.name,
        phoneNumber: inputs.phone,
        clientValue,
      });

      console.log(dataEmployee);
      ToastAndroid.show('Tạo thành công', ToastAndroid.SHORT);

      if (isFirstLogin) {
        setIsLogin(true);
      }

      setClientValue(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Tạo nhân viên</Text>

        <Text style={styles.labelInput}>{email}</Text>

        <CustomInput
          placeholder="Nhập email đăng ký"
          label="Họ và tên"
          onChangeText={text => handleOnChange(text, 'name')}
          error={errors.name}
          onFocus={() => handleErrors(null, 'name')}
        />

        <Text style={styles.labelInput}>Giới tính</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={list}
          maxHeight={300}
          labelField="label"
          valueField="value"
          value={clientValue}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setClientValue(item.value);
            setIsFocus(false);
          }}
        />

        <CustomInput
          placeholder="Nhập Số điện thoại"
          label="Số điện thoại"
          onChangeText={text => handleOnChange(text, 'phone')}
          error={errors.phone}
          onFocus={() => handleErrors(null, 'phone')}
        />

        <TouchableOpacity style={styles.button} onPress={createEmployee}>
          <Text style={styles.text}>Thêm nhân viên</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhite,
    width: '100%',
    paddingHorizontal: Padding.p_5xl,
    paddingVertical: Padding.p_base,
  },

  title: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#643FDB',
    backgroundColor: '#FFFFFF',
    paddingTop: 15,

    paddingBottom: 15,
  },
  touchable: {
    alignItems: 'center',
  },
  labelInput: {
    marginTop: 16,
    color: '#1C1243',
    fontWeight: 'bold',
    fontSize: 16,
  },
  avatar: {
    width: 100,
    height: 100,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  containerTextInput: {
    marginTop: 6,
    width: '100%',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 3,
    overflow: 'hidden',
  },
  iconUsername: {
    width: 20,
    height: 20,
    marginRight: 8,
    marginLeft: 24,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'white',
    height: 40,
    marginLeft: 20,
  },
  button: {
    marginTop: 25,
    height: 48,
    backgroundColor: '#643FDB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  dropDown: {
    marginEnd: 10,
  },

  textFlexBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dashboard: {
    fontSize: 16,
    lineHeight: 29,
    textAlign: 'left',
    color: Color.colorMidnightblue,
    fontWeight: '700',
  },
  logoEvent: {
    marginLeft: 8,
    height: 24,
    width: 24,
    margin: 7,
  },
});

export default AddEmployee;
