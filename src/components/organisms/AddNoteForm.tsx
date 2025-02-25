import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import Button from '../atoms/Button';
import { width } from '../../styles/responsiveSize';


interface Props {
  onSubmit: (content: string) => void;
}

export const AddNoteForm = ({onSubmit}: Props) => {
  const [content, setContent] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        placeholder="What's on your mind?"
      />
      <Button
        btnStyle={styles.button}
        btnText="Post" 
        onPress={() => {
          onSubmit(content)
          setContent('')
        }}></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
  },
  button: {
    width: width/3,
    marginTop: 10,
    alignSelf: 'center'
  }
});
