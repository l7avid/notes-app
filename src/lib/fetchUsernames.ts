/* eslint-disable prettier/prettier */
import { Note } from './api';
import { supabase } from './supabase';

export const fetchUsernames = async (notes: Note[]) => {
  const profileIds = notes.map(note => note.shared_by);
  const {data: profiles, error} = await supabase
    .from('profiles')
    .select('id, username')
    .in('id', profileIds);

  if (error) {
    console.log(error);
    return;
  } else {
    return profiles;
  }
};
