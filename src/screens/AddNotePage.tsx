import {
  Alert,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {height, width} from '../styles/responsiveSize';
import imagePath from '../utils/constants/imagePath';
import {AddNoteForm} from '../components/organisms/AddNoteForm';
import {supabase} from '../lib/supabase';
import {Note} from '../interfaces/Note';

export const AddNotePage = ({navigation}: any) => {
  const [notes, setNotes] = useState<Note[]>();

  const handleSubmit = async (content: string) => {
    const {data, error} = await supabase.from('notes').insert({content}).select();
    if (error) {
      console.log(error);
    } else {
      setNotes([data[0], ...notes])
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const {data, error} = await supabase.from('notes').select('*').order('created_at', {
        ascending: false
      });

      if (error) {
        console.log(error);
      } else {
        setNotes(data);
      }
    };

    fetchNotes();
  }, []);

  return (
    <View style={styles.container}>
      <AddNoteForm onSubmit={handleSubmit}></AddNoteForm>
      <View style={styles.separator}/>
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({item}) => <Text>{item.content}</Text>}></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
