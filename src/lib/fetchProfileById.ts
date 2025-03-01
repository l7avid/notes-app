import {supabase} from './supabase';

export const fetchProfileById = async (id: string) => {
  const {data, error} = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id);

  if (error) {
    console.log(error);
    return;
  } else {
    return data;
  }
};

export type Profile = Awaited<ReturnType<typeof fetchProfileById>>;
