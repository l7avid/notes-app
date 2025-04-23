/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-shadow */
import { User } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Notes } from '../../../lib/api';
import { fetchUserNotes } from '../../../lib/fetchAllNotes';
import { Profile } from '../../../lib/fetchProfileById';
import { supabase } from '../../../lib/supabase';
import navigationScreenNames from '../../../utils/constants/navigationScreenNames';
import { RootState } from '../../redux/store';
import UserListModal from '../components/molecules/UserListModal';
import { AddNoteForm } from '../components/organisms/AddNoteForm';
import NoteCard from '../components/organisms/NoteCard';
import SignOutPage from './SignOutPage';

export const HomePage = ({navigation}: any) => {
  // istanbul ignore next
  const userInfo: User | null = useSelector(
    (state: RootState) => state.userData.userData,
  );

  useEffect(() => {
    if (!userInfo) {
      navigation.replace(navigationScreenNames.LOGIN);
    }
  }, [userInfo, navigation]);

  console.log('User Info: ' + JSON.stringify(userInfo));

  const [notes, setNotes] = useState<Notes>([]);
  const [isUserListVisible, setIsUserListVisible] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleSubmit = async (content: string) => {
    const {data, error} = await supabase
      .from('notes')
      .insert({content})
      .select();
    if (error) {
      console.log(error);
      Alert.alert('Server Error', error.message);
    } else {
      data[0] = {...data[0], shared_by_username: userInfo?.user_metadata.username};
      setNotes([data[0], ...notes]);
    }

    await supabase.from('users-notes').insert({note_id: data![0].id});

    if (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchUserNotes(userInfo.id).then(data => {
        setNotes(
          data.map(note => ({
            ...note,
            shared_by_username: note.profiles?.username || 'Guest',
          })),
        );
      });
    }
  }, [userInfo]);

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
    const {error} = await supabase
      .from('notes')
      .update({content: newContent})
      .eq('id', id)
      .select();

    if (error) {
      console.log(error);
      Alert.alert('Server Error', error.message);
    } else {
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === id ? {...note, content: newContent} : note,
        ),
      );
    }
  };

  const handleShareWith = async (): Promise<Profile[]> => {
    const {data, error} = await supabase.from('profiles').select('*');

    if (error) {
      console.log(error);
      return [];
    } else {
      return data;
    }
  };

  const handleSharePress = async (noteId: string, content: string) => {
    const profiles = await handleShareWith();
    setProfiles(profiles);
    setIsUserListVisible(true);
    setSelectedNoteId(noteId);
    setContent(content);
  };

  return (
    <View style={styles.container}>
      <SignOutPage />
      <AddNoteForm onSubmit={handleSubmit} />
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingTop: 8}}
        renderItem={({item}) => {
          console.log(item.shared_by_username);
          return (
            <NoteCard
              note={item}
              username={
                item.shared_by_username || userInfo?.user_metadata.username
              }
              onDelete={() => handleDeleteNote(item.id)}
              showIcon={
                item.shared_by_username === userInfo?.user_metadata.username
              }
              onEdit={(editedContent: string) =>
                handleEditNote(item.id, editedContent)
              }
              onShare={() => handleSharePress(item.id, item.content)}
            />
          );
        }}
      />
      <UserListModal
        visible={isUserListVisible}
        users={profiles}
        noteId={selectedNoteId}
        onClose={() => setIsUserListVisible(false)}
        content={content}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
