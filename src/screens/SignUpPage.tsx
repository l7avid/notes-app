import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import imagePath from '../utils/constants/imagePath';
import {
  height,
  moderateScale,
  textScale,
  width,
} from '../styles/responsiveSize';
import {login} from '../redux/reducers/userAuth';
import colors from '../styles/colors';
import {useDispatch} from 'react-redux';
import TextInputComponent from '../components/atoms/TextInputComponent';
import Button from '../components/atoms/Button';
import navigationScreenNames from '../utils/constants/navigationScreenNames';
import { supabase } from '../lib/supabase'
import 'react-native-url-polyfill/auto'
import { Note } from '../interfaces/Note';

export default function SignUpPage({navigation}: {navigation: any}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  
  useEffect(() => {
    const fetchNotes = async () => {
      const {data, error} = await supabase.from('notes').select('*');

      if(error) {
        console.log(error + 'Hola');
      } else {
        setNotes(data);
      }
    }

    fetchNotes();
  }, []);


  console.log(notes);
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: colors.themebackgroundcolor}}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.themebackgroundcolor
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
              <TextInputComponent
                placeholder={'Create a Password'}
                onChangeText={text => setPassword(text)}
                value={password}
              />
              <TextInputComponent
                value={confirmPassword}
                placeholder={'Confirm your Password'}
                onChangeText={text => setConfirmPassword(text)}
              />
              <Button
                onPress={() => console.log('Sign Up')}
                btnStyle={{marginTop: moderateScale(98)}}
                btnText={'Sign Up'}
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
});
