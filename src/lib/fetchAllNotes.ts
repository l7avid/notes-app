/* eslint-disable prettier/prettier */
import { supabase } from './supabase';

export const fetchUserNotes = async (userId: string) => {
  const {data, error} = await supabase
    .from('notes')
    .select('*, profiles!shared_by(username)')
    .eq('profile_id', userId);

  if (error) {
    console.log(error);
    return [];
  }
  return data.map(note => ({
    ...note,
    shared_by_username: note.profiles?.username || 'Guest',
  }));
};

export type UserNotes = Awaited<ReturnType<typeof fetchUserNotes>>;
export type UserNote = UserNotes[number];
