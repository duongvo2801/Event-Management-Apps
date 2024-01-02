import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';

import Icon from './Icon';
import { Color } from '../styles/GlobalStyles';

const CustomInputOTP = ({ label, iconName, error, onFocus = () => {}, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={{ flexDirection: 'row', padding: 2 }}>
        <TextInput
          theme={{ colors: { onSurfaceVariant: Color.neutral2 } }}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Nhập mã"
          mode="outlined"
          outlineColor="transparent"
          activeOutlineColor={error ? 'transparent' : Color.primary}
          outlineStyle={{
            backgroundColor: Color.neutral4,
            elevation: 4,
            borderRadius: 16,
          }}
          contentStyle={{ paddingHorizontal: 25 }}
          style={[styles.textInput, error ? styles.textInputError : null]}
          onFocus={() => {
            onFocus();
          }}
          left={iconName ? <TextInput.Icon icon={iconName} /> : null}
          keyboardType="numeric"
          {...props}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.labelInput}>Gửi mã</Text>
        </TouchableOpacity>
      </View>
      {error ? (
        <View style={styles.viewError}>
          <View style={{ marginTop: 2.5 }}>
            <Icon
              source={require('../../assets/icons/ErrorOutline.png')}
              color={Color.semanticRed}
              size="small"
            />
          </View>
          <Text style={styles.textError}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  textInput: {
    height: 48,
    fontSize: 16,
    width: '70%', // Giả sử bạn muốn TextInput chiếm 70% của row
  },
  textInputError: {
    borderWidth: 1,
    borderRadius: 16,
    borderColor: 'red',
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
  viewError: {
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 16,
  },
  textError: {
    marginLeft: 5,
    color: Color.semanticRed,
  },
  iconUsername: {
    width: 20,
    height: 20,
    marginRight: 8,
    marginLeft: 24,
  },
});

export default CustomInputOTP;
