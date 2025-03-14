import {supabase} from './supabase';

export const fetchUserNotes = async (userId: string) => {
  const {data, error} = await supabase
    .from('notes')
    .select('*, profiles!shared_by(username)') // Fetch username from profiles
    .eq('profile_id', userId);

  if (error) {
    console.log(error);
    return [];
  }
  return data.map(note => ({
    ...note,
    shared_by_username: note.profiles?.username || 'Guest', // ✅ Add username dynamically
  }));
};

export type UserNotes = Awaited<ReturnType<typeof fetchUserNotes>>;
export type UserNote = UserNotes[number];
