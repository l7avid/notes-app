import {SignUpWithPasswordCredentials} from '@supabase/supabase-js';
import React, {useEffect, useState} from 'react';
import {
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../components/atoms/Button';
import TextInputComponent from '../components/atoms/TextInputComponent';
import {Note} from '../interfaces/Note';
import {supabase} from '../lib/supabase';
import colors from '../styles/colors';
import {
  height,
  moderateScale,
  textScale,
  width,
} from '../styles/responsiveSize';
import imagePath from '../utils/constants/imagePath';
import navigationScreenNames from '../utils/constants/navigationScreenNames';

interface SignUpFormProps {
  onSignUp: (credentials: SignUpWithPasswordCredentials) => void;
  loading: boolean;
}

export default function SignUpPage({navigation, route}: any) {
  const {onSignUp, loading} = route.params;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);

  // useEffect(() => {
  //   const fetchNotes = async () => {
  //     const {data, error} = await supabase.from('notes').select('*');

  //     if (error) {
  //       console.log(error + 'Hola');
  //     } else {
  //       setNotes(data);
  //     }
  //   };

  //   fetchNotes();
  // }, []);

  // console.log(notes);
  
  const handleSubmit = () => {
    onSignUp({email, password});
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: colors.themebackgroundcolor}}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.themebackgroundcolor,
        }}>
        <ScrollView bounces={false}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ImageBackground
              style={styles.backgroundStyle}
              resizeMode="cover"
              imageStyle={styles.imageBackStyle}
              source={imagePath.headerIc}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={imagePath.backIc}></Image>
              </TouchableOpacity>
            </ImageBackground>
          </TouchableOpacity>
          <View style={styles.containView}>
            <Text style={styles.welcomeTextStyle}>Welcome!</Text>
            <View style={{marginTop: moderateScale(52), alignItems: 'center'}}>
              <TextInputComponent
                placeholder={'Enter your Full Name'}
                onChangeText={text => setName(text)}
                value={name}
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
                  onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                  style={styles.eyeIcon}>
                  <Icon
                    name={isPasswordHidden ? 'eye-off' : 'eye'}
                    size={24}
                    color="gray"
                  />
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
                  onPress={() =>
                    setIsConfirmPasswordHidden(!isConfirmPasswordHidden)
                  }
                  style={styles.eyeIcon}>
                  <Icon
                    name={isConfirmPasswordHidden ? 'eye-off' : 'eye'}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              <Button
                onPress={handleSubmit}
                btnStyle={{marginTop: moderateScale(98)}}
                btnText={'Sign Up'}
                disabled={loading}
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
