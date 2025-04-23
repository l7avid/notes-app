/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import Button from '../components/atoms/Button';
import HideTextComponent from '../components/atoms/HideTextComponent';
import TextInputComponent from '../components/atoms/TextInputComponent';
import { RootState } from '../redux/store';
import colors from '../styles/colors';
import {
  height,
  moderateScale,
  textScale,
  width,
} from '../styles/responsiveSize';
import imagePath from '../utils/constants/imagePath';
import navigationScreenNames from '../utils/constants/navigationScreenNames';

export default function LoginPage({navigation, route}: any) {
  const {onLogin, loading} = route.params || {};
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true);

  const isAuth = useSelector((state: RootState) => !!state.userData?.userData);

  useEffect(() => {
    if (isAuth) {
      navigation.replace(navigationScreenNames.HOME);
    }
  }, [isAuth, navigation]);

  const handleSubmit = () => {
    onLogin({email, password});
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      style={{flex: 1, backgroundColor: colors.themebackgroundcolor}}>
      <View
        style={{
          flex: 1,
          paddingBottom: moderateScale(40),
          backgroundColor: colors.themebackgroundcolor,
        }}>
        <ImageBackground
          style={styles.backgroundStyle}
          resizeMode="cover"
          imageStyle={styles.imageBackStyle}
          source={imagePath.headerIc}>
          {/* <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={imagePath.backIc}></Image>
          </TouchableOpacity> */}
        </ImageBackground>

        <View style={styles.containViewStyle}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Image
            style={styles.whiteBoardImageStyle}
            source={imagePath.loginIc}
          />
          <View>
            <TextInputComponent
              value={email}
              onChangeText={text => setEmail(text)}
              placeholder={'Email'}
              keyboardType="default"
            />
            <View style={styles.inputContainer}>
              <TextInputComponent
                value={password}
                onChangeText={text => setPassword(text)}
                placeholder={'Password'}
                secureTextEntry={isPasswordHidden}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                style={styles.eyeIcon}>
                <HideTextComponent isHidden={isPasswordHidden} />
              </TouchableOpacity>
            </View>
          </View>

          <Button
            btnStyle={{marginTop: moderateScale(20)}}
            btnText={'Sign In'}
            disabled={loading || !email || !password}
            onPress={handleSubmit}
          />
          <Text style={styles.readyText}>
            Don't have an account?{' '}
            <Text
              style={styles.signinText}
              onPress={() => navigation.navigate(navigationScreenNames.SIGNUP)}>
              Sign Up
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageBackStyle: {
    height: height / 6.3,
    width: width / 2.1,
  },
  backgroundStyle: {
    paddingHorizontal: moderateScale(30),
    paddingVertical: moderateScale(40),
  },
  containViewStyle: {
    alignItems: 'center',
    marginTop: moderateScale(44),
  },
  welcomeText: {
    fontSize: textScale(20),
    fontWeight: '500',
    color: colors.black,
  },
  whiteBoardImageStyle: {
    alignItems: 'center',
    marginHorizontal: moderateScale(16),
    flex: 0.5,
    justifyContent: 'center',
    marginBottom: moderateScale(10),
  },
  forgetText: {
    color: colors.btnColor,
    fontSize: textScale(13),
    fontWeight: '500',
    marginTop: moderateScale(12),
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
  textInput: {
    marginBottom: moderateScale(10),
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
