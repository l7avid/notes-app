import {User} from '@supabase/supabase-js';
import React, {useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {AddNoteForm} from '../components/organisms/AddNoteForm';
import NoteCard from '../components/organisms/NoteCard';
import {fetchNotes, Notes} from '../lib/api';
import {supabase} from '../lib/supabase';
import {RootState} from '../redux/store';
import navigationScreenNames from '../utils/constants/navigationScreenNames';
import SignOutPage from './SignOutPage';
import { Profile } from '../lib/fetchProfileById';

export const AddNotePage = ({navigation}: any) => {
  const userInfo: User = useSelector(
    (state: RootState) => state.userData.userData!,
  );
  const [notes, setNotes] = useState<Notes>([]);

  if (!userInfo) {
    navigation.navigate(navigationScreenNames.LOGIN);
  }

  const handleSubmit = async (content: string) => {
    const {data, error} = await supabase
      .from('notes')
      .insert({content})
      .select();
    if (error) {
      console.log(error);
      Alert.alert('Server Error', error.message);
    } else {
      setNotes([data[0], ...notes]);
    }
  };

  useEffect(() => {
    fetchNotes().then(data => setNotes(data));
  }, []);

  const handleDeleteNote = async (id: string) => {
    const {error} = await supabase.from('notes').delete().eq('id', id);
    if (error) {
      console.log(error);
      Alert.alert('Server Error', error.message);
    } else {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const handleEditNote = async (id: string, newContent: string) => {
    const {data, error} = await supabase
      .from('notes')
      .update({content: newContent})
      .eq('id', id)
      .select();

    if (error) {
      console.log(error);
      Alert.alert('Server Error', error.message);
    } else {
      // Update the local state with the edited note
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === id ? {...note, content: newContent} : note,
        ),
      );
    }
  };

  const handleShareWith = async (): Promise<Profile[]> => {
    const {data, error} = await supabase
      .from('profiles')
      .select('*');

      if (error) {
        console.log(error);
        return [];
      } else {
        return data;
      }
  };

  return (
    <View style={styles.container}>
      <SignOutPage />
      <AddNoteForm onSubmit={handleSubmit}></AddNoteForm>
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingTop: 8}}
        renderItem={({item}) => (
          <NoteCard
            note={item}
            username={userInfo!.user_metadata['username']}
            onDelete={() => handleDeleteNote(item.id)}
            onEdit={(editedContent: string) =>
              handleEditNote(item.id, editedContent)
            }
            onShare={handleShareWith}
          />
        )}></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
