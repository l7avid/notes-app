/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import imagePath from '../../../utils/constants/imagePath';
import navigationScreenNames from '../../../utils/constants/navigationScreenNames';
import Button from '../components/atoms/Button';
import HideTextComponent from '../components/atoms/HideTextComponent';
import TextInputComponent from '../components/atoms/TextInputComponent';

export default function SignUpPage({navigation, route}: any) {
  const {onSignUp} = route.params;
  const [full_name, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState<boolean>(true);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const handleSubmit = async () => {
    const result = await onSignUp({
      email,
      password,
      options: {data: {username, full_name}},
    });

    if (result?.error) {
      Alert.alert('Sign Up failed', result.error.message);
    } else {
      Alert.alert(
        'Check your Email',
        'Please review your mailbox to confirm your account',
      );
    }
    navigation.navigate(navigationScreenNames.LOGIN);
  };

  useEffect(() => {
  const isValid =
    !!full_name.trim() &&
    !!username.trim() &&
    !!email.trim() &&
    !!password.trim() &&
    !!confirmPassword.trim();

  const passwordMatch = password === confirmPassword;

  const shouldEnable = isValid && passwordMatch;

  setIsDisabled(!shouldEnable);

  console.log({ isValid, passwordMatch, shouldEnable });
}, [full_name, username, email, password, confirmPassword]);


  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: colors.themebackgroundcolor}}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.themebackgroundcolor,
        }}>
        <ScrollView bounces={false}>
          <TouchableOpacity testID="button" onPress={() => navigation.goBack()}>
            <ImageBackground
              style={styles.backgroundStyle}
              resizeMode="cover"
              imageStyle={styles.imageBackStyle}
              source={imagePath.headerIc}>
              <TouchableOpacity
                testID="button-back"
                onPress={() => navigation.goBack()}>
                <Image source={imagePath.backIc} />
              </TouchableOpacity>
            </ImageBackground>
          </TouchableOpacity>
          <View style={styles.containView}>
            <Text style={styles.welcomeTextStyle}>Welcome!</Text>
            <View style={{marginTop: moderateScale(52), alignItems: 'center'}}>
              <TextInputComponent
                placeholder={'Enter your Full Name'}
                onChangeText={text => setFullName(text)}
                value={full_name}
              />
              <TextInputComponent
                placeholder={'Enter your Username'}
                onChangeText={text => setUsername(text)}
                value={username}
              />
              <TextInputComponent
                onChangeText={text => setEmail(text)}
                value={email}
                placeholder={'Enter your email address'}
              />
              <View style={styles.inputContainer}>
                <TextInputComponent
                  placeholder={'Create a Password'}
                  onChangeText={text => setPassword(text)}
                  value={password}
                  secureTextEntry={isPasswordHidden}
                />
                <TouchableOpacity
                  testID="button-password"
                  onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                  style={styles.eyeIcon}>
                  <HideTextComponent isHidden={isPasswordHidden} />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <TextInputComponent
                  value={confirmPassword}
                  placeholder={'Confirm your Password'}
                  onChangeText={text => setConfirmPassword(text)}
                  secureTextEntry={isConfirmPasswordHidden}
                />
                <TouchableOpacity
                  testID="button-confirm-password"
                  onPress={() =>
                    setIsConfirmPasswordHidden(!isConfirmPasswordHidden)
                  }
                  style={styles.eyeIcon}>
                  <HideTextComponent isHidden={isConfirmPasswordHidden} />
                </TouchableOpacity>
              </View>
              <Button
                onPress={handleSubmit}
                btnStyle={{marginTop: moderateScale(98)}}
                btnText={'Sign Up'}
                disabled={isDisabled}
              />
              <Text style={styles.readyText}>
                {' '}
                Already have an account ?
                <Text
                  style={styles.signinText}
                  onPress={() =>
                    navigation.navigate(navigationScreenNames.LOGIN)
                  }>
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    paddingHorizontal: moderateScale(30),
    paddingVertical: moderateScale(40),
  },
  imageBackStyle: {
    height: height / 6.3,
    width: width / 2.1,
  },
  goBackStyle: {
    height: moderateScale(26),
    width: moderateScale(34),
  },
  containView: {
    alignItems: 'center',
    marginTop: moderateScale(80),
  },
  welcomeTextStyle: {
    fontSize: textScale(20),
    fontWeight: '500',
    color: colors.black,
  },
  readyText: {
    fontSize: textScale(15),
    marginTop: moderateScale(32),
  },
  signinText: {
    fontSize: textScale(15),
    color: colors.btnColor,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
  },
  eyeIcon: {
    padding: 10,
    position: 'absolute',
    right: 10,
  },
});
