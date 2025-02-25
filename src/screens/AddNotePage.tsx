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
import {fetchNotes, Notes} from '../lib/api';
import NoteCard from '../components/organisms/NoteCard';

export const AddNotePage = ({navigation}: any) => {
  const [notes, setNotes] = useState<Notes>();

  const handleSubmit = async (content: string) => {
    const {data, error} = await supabase
      .from('notes')
      .insert({content})
      .select();
    if (error) {
      console.log(error);
    } else {
      setNotes([data[0], ...notes]);
    }
  };

  useEffect(() => {
    fetchNotes().then(data => setNotes(data));
  }, []);

  return (
    <View style={styles.container}>
      <AddNoteForm onSubmit={handleSubmit}></AddNoteForm>
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingTop: 8}}
        renderItem={({item}) => <NoteCard note={item}/>}></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
