/* eslint-disable prettier/prettier */
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import UserListModal from '../../../src/components/molecules/UserListModal';
import { Profile } from '../../../src/lib/fetchProfileById';
import { supabase } from '../../../src/lib/supabase';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('../../../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(),
    })),
  },
}));

const mockOnClose = jest.fn();
const mockInsert = jest.fn();

const users: Profile[] = [
  {
    id: '1',
    username: 'alice',
    full_name: null,
    avatar_url: null,
    updated_at: null,
    website: null,
  },
  {
    id: '2',
    full_name: 'Bob',
    username: null,
    avatar_url: null,
    updated_at: null,
    website: null,
  },
];

const content = 'Test note content';

beforeEach(() => {
  (useSelector as unknown as jest.Mock).mockReturnValue({
    id: 'current-user-id',
  });

  (supabase.from as jest.Mock).mockReturnThis();
  (supabase.from as jest.Mock).mockReturnValue({insert: mockInsert});
  jest.clearAllMocks();
});

describe('UserListModal', () => {
  it('renders when visible is true', () => {
    const {getByText} = render(
      <UserListModal
        visible={true}
        users={users}
        noteId="123"
        onClose={mockOnClose}
        content={content}
      />,
    );

    expect(getByText('alice')).toBeTruthy();
    expect(getByText('Bob')).toBeTruthy();
    expect(getByText('Close')).toBeTruthy();
  });

  it('does not render when visible is false', () => {
    const {queryByText} = render(
      <UserListModal
        visible={false}
        users={users}
        noteId="123"
        onClose={mockOnClose}
        content={content}
      />,
    );

    expect(queryByText('alice')).toBeNull();
  });

  it('calls onClose when Close button is pressed', () => {
    const {getByText} = render(
      <UserListModal
        visible={true}
        users={users}
        noteId="123"
        onClose={mockOnClose}
        content={content}
      />,
    );

    fireEvent.press(getByText('Close'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls Supabase insert when a user is tapped', async () => {
    mockInsert.mockResolvedValueOnce({error: null});
    const {getByText} = render(
      <UserListModal
        visible={true}
        users={users}
        noteId="123"
        onClose={mockOnClose}
        content={content}
      />,
    );

    fireEvent.press(getByText('alice'));

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith([
        {
          profile_id: '1',
          content: content,
          shared_by: 'current-user-id',
        },
      ]);
    });
  });

  it('shows "Unknown User" if no username or full_name exists', () => {
    const {getByText} = render(
      <UserListModal
        visible={true}
        users={[
          {
            id: '3',
            username: null,
            full_name: null,
            avatar_url: null,
            updated_at: null,
            website: null,
          },
        ]}
        noteId="123"
        onClose={mockOnClose}
        content={content}
      />,
    );

    expect(getByText('Unknown User')).toBeTruthy();
  });

  it('shows alert if Supabase insert fails', async () => {
    mockInsert.mockResolvedValueOnce({error: {message: 'Insert failed'}});
    const alertSpy = jest.spyOn(Alert, 'alert');

    const {getByText} = render(
      <UserListModal
        visible={true}
        users={users}
        noteId="123"
        onClose={mockOnClose}
        content={content}
      />,
    );

    fireEvent.press(getByText('alice'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Server Error', 'Insert failed');
    });

    alertSpy.mockRestore();
  });

  it('renders correctly with an empty user list', () => {
    const {queryAllByTestId, getByText} = render(
      <UserListModal
        visible={true}
        users={[]}
        noteId="123"
        onClose={mockOnClose}
        content={content}
      />,
    );

    expect(getByText('Close')).toBeTruthy();
    expect(queryAllByTestId('user-item')).toHaveLength(0);
  });
});
