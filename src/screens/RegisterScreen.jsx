import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Keyboard, TouchableOpacity, ToastAndroid } from 'react-native';
import { TextInput } from 'react-native-paper';

import { CustomButton, CustomInput, CustomPassInput } from '../components/common';
import { Color, FontSize, Padding } from '../components/styles/GlobalStyles';
import { axiosPost } from '../configs';
import { emailRegisterKey, otpSecretKey } from '../constants/constant';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [countdown, setcountdown] = useState(60);
  const [showBtnResendOtp, setShowBtnResendOtp] = useState(false);
  const [inputOtp, setInputOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [firstSend, setFirstSend] = useState(true);
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleErrors = (errorMessage, input) => {
    setErrors(prevState => ({ ...prevState, [input]: errorMessage }));
  };
  const handleOnChange = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };

  const verifiedAccount = async () => {
    const response = await axiosPost('/auth/send-otp/confirm-email', { username: inputs.email });

    if (!inputs.email) {
      handleErrors('Vui lòng nhập email', 'email');
    } else if (response.message === 'Account already exists') {
      handleErrors('Email đã tồn tại', 'email');
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleErrors('Vui lòng nhập Email hợp lệ', 'email');
    }

    if (!inputs.password) {
      handleErrors('Vui lòng nhập mật khẩu', 'password');
    } else if (inputs.password.length < 6) {
      handleErrors('Mật khẩu phải có ít nhất 6 ký tự', 'password');
    }

    if (!inputs.confirmPassword) {
      handleErrors('Vui lòng nhập lại mật khẩu', 'confirmPassword');
    } else if (inputs.confirmPassword !== inputs.password) {
      handleErrors('Mật khẩu không trùng khớp', 'confirmPassword');
    }

    // if (!errors.email && !errors.password && !errors.confirmPassword) {
    if (inputs.email && inputs.password && inputs.confirmPassword) {
      console.log(response);
      if (response.otpSecret) {
        // console.log(inputs.email);
        // console.log(inputs.password);

        setFirstSend(false);
        setcountdown(60);

        await AsyncStorage.setItem(otpSecretKey, response.otpSecret);
        await AsyncStorage.setItem(emailRegisterKey, inputs.email);
      }
    }
  };

  const handleVerifiedOtp = async () => {
    const otpSecret = await AsyncStorage.getItem(otpSecretKey);
    const response = await axiosPost('/auth/verify-otp', {
      // username: inputs.email,
      otp: inputOtp,
      otpSecret,
    });

    if (!inputOtp) {
      handleErrors('Vui lòng nhập mã OTP', 'inputOtp');
    } else if (inputOtp.length !== 6 || !/^\d+$/.test(inputOtp)) {
      handleErrors('Mã OTP phải là 6 số', 'inputOtp');
    } else if (response.message === 'Otp was expired or invalid') {
      handleErrors('Mã OTP đã hết hạn hoặc không hợp lệ', 'inputOtp');
    } else {
      handleErrors('', 'inputOtp'); // Reset lỗi nếu không có lỗi
      registerHandler(); // Gọi hàm đăng ký khi OTP hợp lệ
    }
  };

  const handleResendOtp = async () => {
    setShowBtnResendOtp(false);
    setcountdown(60);
    const email = await AsyncStorage.getItem(emailRegisterKey);
    const responseResendOtp = await axiosPost('/auth/resend-otp/confirm-email', {
      username: email,
    });
    await AsyncStorage.setItem(otpSecretKey, responseResendOtp.otpSecret);
    console.log(email);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setcountdown(prev => prev - 1);
    }, 1000);

    if (countdown === 0) {
      setShowBtnResendOtp(true);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const registerHandler = async () => {
    const otpSecret = await AsyncStorage.getItem(otpSecretKey);
    console.log('otpSecret: ' + otpSecret);
    Keyboard.dismiss();
    const response = await axiosPost('/auth/sign-up', {
      username: inputs.email,
      password: inputs.password,
      confirmPassword: inputs.confirmPassword,
      otp: inputOtp,
      otpSecret,
    });

    if (!inputOtp) {
      handleErrors('Vui lòng nhập mã OTP');
    } else if (inputOtp.length > 6 || inputOtp.length < 6) {
      handleErrors('Mã OTP Phải có 6 số');
    } else if (response.message === 'Otp was expired or invalid') {
      handleErrors('Otp đã hết hạn hoặc không hợp lệ');
    }
    console.log(response);
    // if (response.username) {
    ToastAndroid.show('Đăng ký thành công', ToastAndroid.SHORT);
    navigation.navigate('Login');
    // }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.title, styles.titleSpaceBlock]}>
        <Text style={styles.ngNhp}>Đăng ký</Text>
      </View>
      <CustomInput
        placeholder="Nhập email đăng ký"
        label="Email"
        keyboardType="email-address"
        onChangeText={text => handleOnChange(text, 'email')}
        error={errors.email}
        onFocus={() => handleErrors(null, 'email')}
      />

      <CustomPassInput
        label="Mật khẩu"
        placeholder="Nhập mật khẩu đăng ký"
        onChangeText={text => handleOnChange(text, 'password')}
        error={errors.password}
        onFocus={() => handleErrors(null, 'password')}
      />

      <CustomPassInput
        label="Nhập lại mật khẩu"
        placeholder="Nhập lại mật khẩu đăng ký"
        onChangeText={text => handleOnChange(text, 'confirmPassword')}
        error={errors.confirmPassword}
        onFocus={() => handleErrors(null, 'confirmPassword')}
      />

      <View style={[styles.containerTextInputOTP, errors ? styles.textInputError : null]}>
        <TextInput
          theme={{ colors: { onSurfaceVariant: Color.neutral2 } }}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Nhập mã"
          mode="outlined"
          style={styles.textInputOTP}
          outlineColor="transparent"
          outlineStyle={{
            backgroundColor: Color.neutral4,
            elevation: 4,
            borderRadius: 16,
          }}
          contentStyle={{ paddingHorizontal: 25 }}
          keyboardType="numeric"
          onChangeText={text => setInputOtp(text)}
          // onFocus={() => setErrors(null)}
        />
        {firstSend ? (
          <TouchableOpacity style={styles.sendButton} onPress={verifiedAccount}>
            <Text style={styles.labelInput}>Gửi mã</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.containerTextInputResentOTP}>
            {showBtnResendOtp === true ? (
              <TouchableOpacity style={styles.sendButton} onPress={handleResendOtp}>
                <Text style={styles.labelInputOTP}>Gửi lại mã</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.sendButton}>
                <Text style={styles.labelInputOTP}>Gửi lại mã ({countdown}s)</Text>
              </View>
            )}
          </View>
        )}
      </View>
      {/* {errors ? (
        <View style={styles.viewError}>
          <View style={{ marginTop: 2.5 }}>
            <Icon
              source={require('../assets/icons/ErrorOutline.png')}
              color={Color.semanticRed}
              size="small"
            />
          </View>
          <Text style={styles.textError}>{errors.errorMessage}</Text>
        </View>
      ) : null} */}

      <CustomButton title="Đăng ký" onPress={handleVerifiedOtp} />

      <View style={[styles.footer, styles.titleSpaceBlock]}>
        <Text style={[styles.chaCTi, styles.ngKTypo]}>Đã có tài khoản?</Text>
        <Text style={[styles.ngK, styles.ngKTypo]} onPress={() => navigation.navigate('Login')}>
          Đăng nhập
        </Text>
      </View>
    </View>
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
  iconLayout: {
    height: 24,
    width: 24,
    overflow: 'hidden',
  },
  titleSpaceBlock: {
    marginTop: 10,
    alignSelf: 'stretch',
  },
  hocClr: {
    color: Color.neutral2,
    fontWeight: '500',
  },
  dividerLayout: {
    height: 2,
    backgroundColor: Color.colorWhitesmoke,
    flex: 1,
  },
  ngKTypo: {
    textAlign: 'left',
    lineHeight: 24,
    fontSize: FontSize.headlines16Medium_size,
  },
  ngNhp: {
    fontSize: FontSize.title24Bold_size,
    lineHeight: 29,
    textAlign: 'center',
    color: Color.colorMidnightblue,
    fontWeight: '700',
    flex: 1,
  },
  title: {
    padding: 10,
    margin: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  forgotPassword: {
    justifyContent: 'flex-end',
    textAlign: 'right',
    marginTop: 16,
    color: Color.colorBlueviolet,
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    marginTop: 16,
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
  hoc: {
    marginLeft: 8,
    lineHeight: 24,
    fontSize: FontSize.headlines16Medium_size,
    color: Color.neutral2,
    textAlign: 'center',
  },
  dividerItem: {
    marginLeft: 8,
  },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  spacer: {
    overflow: 'hidden',
    backgroundColor: Color.colorWhite,
  },
  chaCTi: {
    color: Color.neutral2,
    fontWeight: '500',
  },
  ngK: {
    color: Color.colorDarkorange,
    marginLeft: 8,
    fontWeight: '700',
    textAlign: 'left',
  },
  footer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textField: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
  },
  drowDownError: {
    borderWidth: 1,
    borderColor: 'red',
  },
  textError: {
    marginLeft: 5,
    color: Color.semanticRed,
  },
  viewError: {
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 16,
  },
  textInputOTP: {
    height: 48,
    fontSize: 16,
    width: '70%', // Giả sử bạn muốn TextInput chiếm 70% của row
  },

  sendButton: {
    width: '30%', // Giả sử bạn muốn TouchableOpacity chiếm 30% của row
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.colorWhitesmoke, // Thêm màu nền cho nút gửi mã
    borderRadius: 16,
    marginLeft: 8,
  },
  labelInput: {
    color: 'black', // Màu chữ trắng cho nút Gửi mã
  },
  containerTextInputOTP: {
    flexDirection: 'row',
    padding: 2,
    marginTop: 10,
  },
  containerTextInputResentOTP: {
    width: '100%',
    height: '100%',
    padding: 2,
  },
  labelInputOTP: {
    width: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 45,
    color: 'black', // Màu chữ trắng cho nút Gửi mã
  },
});

export default RegisterScreen;
