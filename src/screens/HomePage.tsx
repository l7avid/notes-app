import { User } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import UserListModal from '../components/molecules/UserListModal';
import { AddNoteForm } from '../components/organisms/AddNoteForm';
import NoteCard from '../components/organisms/NoteCard';
import { fetchNotes, Notes } from '../lib/api';
import { Profile } from '../lib/fetchProfileById';
import { supabase } from '../lib/supabase';
import { RootState } from '../redux/store';
import navigationScreenNames from '../utils/constants/navigationScreenNames';
import SignOutPage from './SignOutPage';

export const HomePage = ({ navigation }: any) => {
  const userInfo: User | null = useSelector(
    (state: RootState) => state.userData.userData
  );

  const isAuth = useSelector((state: RootState) => !!state.userData?.userData);

  useEffect(() => {
    if (!userInfo) {
      navigation.replace(navigationScreenNames.LOGIN);
    }
  }, [userInfo, navigation]);

  console.log("User Info: " + JSON.stringify(userInfo));

  const [notes, setNotes] = useState<Notes>([]);
  const [isUserListVisible, setIsUserListVisible] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');

  const handleSubmit = async (content: string) => {
    const { data, error } = await supabase
      .from('notes')
      .insert({ content })
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
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) {
      console.log(error);
      Alert.alert('Server Error', error.message);
    } else {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const handleEditNote = async (id: string, newContent: string) => {
    const { data, error } = await supabase
      .from('notes')
      .update({ content: newContent })
      .eq('id', id)
      .select();

    if (error) {
      console.log(error);
      Alert.alert('Server Error', error.message);
    } else {
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === id ? { ...note, content: newContent } : note
        )
      );
    }
  };

  const handleShareWith = async (): Promise<Profile[]> => {
    const { data, error } = await supabase.from('profiles').select('*');

    if (error) {
      console.log(error);
      return [];
    } else {
      return data;
    }
  };

  const handleSharePress = async (noteId: string) => {
    const profiles = await handleShareWith();
    setProfiles(profiles);
    setIsUserListVisible(true);
    setSelectedNoteId(noteId);
  };

  return (
    <View style={styles.container}>
      <SignOutPage />
      <AddNoteForm onSubmit={handleSubmit} />
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingTop: 8 }}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            username={userInfo?.user_metadata?.['username'] || 'Guest'}
            onDelete={() => handleDeleteNote(item.id)}
            onEdit={(editedContent: string) => handleEditNote(item.id, editedContent)}
            onShare={() => handleSharePress(item.id)}
            shareData={profiles}
            isShareListVisible={isUserListVisible}
          />
        )}
      />
      <UserListModal
        visible={isUserListVisible}
        users={profiles}
        noteId={selectedNoteId}
        onClose={() => setIsUserListVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
