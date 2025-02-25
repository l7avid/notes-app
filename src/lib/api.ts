import {supabase} from './supabase';

export const fetchNotes = async () => {
  const {data, error} = await supabase
    .from('notes')
    .select('*')
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.log(error);
    return [];
  } else {
    return data;
  }
};

export type Notes = Awaited<ReturnType<typeof fetchNotes>>;
export type Note = Notes[number]
