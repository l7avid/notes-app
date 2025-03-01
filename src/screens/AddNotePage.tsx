import { User } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { AddNoteForm } from '../components/organisms/AddNoteForm';
import NoteCard from '../components/organisms/NoteCard';
import { fetchNotes, Notes } from '../lib/api';
import { Profile } from '../lib/fetchProfileById';
import { supabase } from '../lib/supabase';
import { RootState } from '../redux/store';
import navigationScreenNames from '../utils/constants/navigationScreenNames';
import SignOutPage from './SignOutPage';

export const AddNotePage = ({navigation}: any) => {
  const userInfo: User = useSelector(
    (state: RootState) => state.userData.userData!,
  );
  const [notes, setNotes] = useState<Notes>();

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
    } else {
      setNotes([data[0], ...notes]);
    }
  };

  useEffect(() => {
    fetchNotes().then(data => setNotes(data));
  }, []);

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
