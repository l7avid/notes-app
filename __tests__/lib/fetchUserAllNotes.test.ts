import { fetchUserNotes } from '../../src/lib/fetchAllNotes';
import { supabase } from '../../src/lib/supabase';

jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('fetchUserNotes', () => {
  const mockUserId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns mapped data with shared_by_username when data is returned', async () => {
    const mockData = [
      {
        id: 1,
        title: 'Note 1',
        profiles: {username: 'alice'},
        profile_id: mockUserId,
      },
      {id: 2, title: 'Note 2', profiles: null, profile_id: mockUserId},
    ];

    const eqMock = jest.fn().mockResolvedValue({data: mockData, error: null});
    const selectMock = jest.fn(() => ({eq: eqMock}));
    (supabase.from as jest.Mock).mockReturnValue({select: selectMock});

    const result = await fetchUserNotes(mockUserId);

    expect(supabase.from).toHaveBeenCalledWith('notes');
    expect(selectMock).toHaveBeenCalledWith('*, profiles!shared_by(username)');
    expect(eqMock).toHaveBeenCalledWith('profile_id', mockUserId);

    expect(result).toEqual([
      {...mockData[0], shared_by_username: 'alice'},
      {...mockData[1], shared_by_username: 'Guest'},
    ]);
  });

  it('returns empty array and logs error when supabase returns error', async () => {
    const mockError = new Error('Something went wrong');

    const eqMock = jest.fn().mockResolvedValue({data: null, error: mockError});
    const selectMock = jest.fn(() => ({eq: eqMock}));
    (supabase.from as jest.Mock).mockReturnValue({select: selectMock});

    console.log = jest.fn();

    const result = await fetchUserNotes(mockUserId);

    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(result).toEqual([]);
  });
});
