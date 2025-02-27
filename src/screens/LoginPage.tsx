import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../components/atoms/Button';
import TextInputComponent from '../components/atoms/TextInputComponent';
import colors from '../styles/colors';
import {
  height,
  moderateScale,
  textScale,
  width,
} from '../styles/responsiveSize';
import imagePath from '../utils/constants/imagePath';
import navigationScreenNames from '../utils/constants/navigationScreenNames';

const screenWidth = Dimensions.get('window').width;

import type {SignInWithPasswordCredentials} from '@supabase/supabase-js';

interface LoginFormProps {
  onLogin: (credentials: SignInWithPasswordCredentials) => void;
  loading: boolean;
}

export default function LoginPage({navigation, route}: any) {
  const { onLogin, loading, onSignUp } = route.params || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={imagePath.backIc}></Image>
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.containViewStyle}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Image
            style={styles.whiteBoardImageStyle}
            source={imagePath.loginIc}
          />
          <TextInputComponent
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder={'Email'}
            keyboardType="default"
          />
          <TextInputComponent
            value={password}
            onChangeText={text => setPassword(text)}
            placeholder={'Password'}
          />
          <Text style={styles.forgetText}>Forgot Password ?</Text>
          <Button
            btnStyle={{marginTop: moderateScale(20)}}
            btnText={'Sign In'}
            disabled={loading || !email || !password}
            onPress={handleSubmit}
          />
          <Text style={styles.readyText}>
            Don't have an account ?
            <Text
              style={styles.signinText}
              onPress={() =>
                navigation.navigate(navigationScreenNames.SIGNUP)
              }>
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
});
