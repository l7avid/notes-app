import {fetchUsernames} from '../../src/lib/fetchUsernames';
import {supabase} from '../../src/lib/supabase';

type Note = {
  content: string;
  created_at: string;
  id: string;
  profile_id: string;
  shared_by: string;
  shared_by_username?: string | undefined;
};

jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('fetchUsernames', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches profiles with usernames for given notes', async () => {
    const notes: Note[] = [
      {
        content: 'Note 1',
        created_at: '2025-05-31T00:00:00Z',
        id: 'note1',
        profile_id: 'profile1',
        shared_by: 'user1',
      },
      {
        content: 'Note 2',
        created_at: '2025-05-31T00:00:01Z',
        id: 'note2',
        profile_id: 'profile2',
        shared_by: 'user2',
      },
      {
        content: 'Note 3',
        created_at: '2025-05-31T00:00:02Z',
        id: 'note3',
        profile_id: 'profile3',
        shared_by: 'user3',
      },
    ];

    const mockProfiles = [
      {id: 'user1', username: 'Alice'},
      {id: 'user2', username: 'Bob'},
      {id: 'user3', username: 'Charlie'},
    ];

    const inMock = jest
      .fn()
      .mockResolvedValue({data: mockProfiles, error: null});
    const selectMock = jest.fn(() => ({in: inMock}));
    (supabase.from as jest.Mock).mockReturnValue({select: selectMock});

    const result = await fetchUsernames(notes);

    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(selectMock).toHaveBeenCalledWith('id, username');
    expect(inMock).toHaveBeenCalledWith('id', ['user1', 'user2', 'user3']);
    expect(result).toEqual(mockProfiles);
  });

  it('logs error and returns undefined when supabase returns an error', async () => {
    const notes: Note[] = [
      {
        content: 'Note 1',
        created_at: '2025-05-31T00:00:00Z',
        id: 'note1',
        profile_id: 'profile1',
        shared_by: 'user1',
      },
    ];

    const mockError = new Error('Database error');

    const inMock = jest.fn().mockResolvedValue({data: null, error: mockError});
    const selectMock = jest.fn(() => ({in: inMock}));
    (supabase.from as jest.Mock).mockReturnValue({select: selectMock});

    console.log = jest.fn();

    const result = await fetchUsernames(notes);

    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(result).toBeUndefined();
  });
});
