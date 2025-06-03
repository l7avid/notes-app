import {fetchProfileById} from '../../src/lib/fetchProfileById';
import {supabase} from '../../src/lib/supabase';

jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('fetchProfileById', () => {
  const mockId = 'profile-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the first profile object when data is returned', async () => {
    const mockProfile = {
      id: mockId,
      username: 'alice',
      email: 'alice@example.com',
    };

    const eqMock = jest
      .fn()
      .mockResolvedValue({data: [mockProfile], error: null});
    const selectMock = jest.fn(() => ({eq: eqMock}));
    (supabase.from as jest.Mock).mockReturnValue({select: selectMock});

    const result = await fetchProfileById(mockId);

    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(eqMock).toHaveBeenCalledWith('id', mockId);

    expect(result).toEqual(mockProfile);
  });

  it('returns undefined and logs error when supabase returns error', async () => {
    const mockError = new Error('DB error');

    const eqMock = jest.fn().mockResolvedValue({data: null, error: mockError});
    const selectMock = jest.fn(() => ({eq: eqMock}));
    (supabase.from as jest.Mock).mockReturnValue({select: selectMock});

    console.log = jest.fn();

    const result = await fetchProfileById(mockId);

    expect(console.log).toHaveBeenCalledWith(mockError);
    expect(result).toBeUndefined();
  });
});
