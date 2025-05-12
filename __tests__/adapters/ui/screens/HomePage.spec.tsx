/* eslint-disable prettier/prettier */
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { act } from 'react-test-renderer';
import { HomePage } from '../../../../src/adapters/ui/screens/HomePage';
import * as fetchNotes from '../../../../src/lib/fetchAllNotes';
import { supabase } from '../../../../src/lib/supabase';
import navigationScreenNames from '../../../../src/utils/constants/navigationScreenNames';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock(
  '../../../../src/adapters/ui/components/organisms/AddNoteForm',
  () => ({
    AddNoteForm: ({onSubmit}: any) => {
      const {Text, TouchableOpacity} = require('react-native');
      return (
        <TouchableOpacity
          onPress={() => onSubmit('New Note')}
          testID="add-note-form">
          <Text>Add</Text>
        </TouchableOpacity>
      );
    },
  }),
);

jest.mock(
  '../../../../src/adapters/ui/components/organisms/NoteCard',
  () => (props: any) => {
    const {View, Text, TouchableOpacity} = require('react-native');
    return (
      <View testID={`note-card-${props.note.id}`}>
        <Text>{props.note.content}</Text>
        <TouchableOpacity onPress={props.onDelete} testID="delete-button">
          <Text>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.onEdit('Content edited')}
          testID={`edit-button-${props.note.id}`}>
          <Text>{`text-${props.note.content}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.onShare} testID="share-button">
          <Text>Share</Text>
        </TouchableOpacity>
      </View>
    );
  },
);

jest.mock(
  '../../../../src/adapters/ui/components/molecules/UserListModal',
  () => () => {
    const {View} = require('react-native');
    return <View testID="user-list-modal" />;
  },
);

jest.mock('../../../../src/adapters/ui/screens/SignOutPage', () => () => {
  const {View} = require('react-native');
  return <View testID="signout-page" />;
});

jest.mock('../../../../src/lib/supabase', () => {
  const mockSelect = jest.fn().mockResolvedValue({
    data: [{id: 'new-note', content: 'New Note'}],
    error: null,
  });

  const mockEq = jest.fn(() => ({
    select: jest.fn().mockResolvedValue({data: {}, error: null}),
  }));

  return {
    supabase: {
      from: jest.fn(() => ({
        insert: jest.fn(() => ({
          select: mockSelect,
        })),
        delete: jest.fn(() => ({
          eq: jest.fn().mockResolvedValue({data: {}, error: null}),
        })),
        update: jest.fn(() => ({
          eq: mockEq,
        })),
        select: jest.fn().mockResolvedValue({data: [], error: null}),
      })),
    },
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    (useSelector as unknown as jest.Mock).mockReturnValue({
      id: 'user1',
      user_metadata: {username: 'david'},
    });

    jest.spyOn(fetchNotes, 'fetchUserNotes').mockResolvedValue([
      {
        shared_by_username: 'username',
        content: 'Test note',
        created_at: '',
        id: 'note-1',
        profile_id: 'profile1',
        shared_by: 'user1',
        profiles: {
          username: 'username',
        },
      },
    ]);
  });

  it('renders required components', async () => {
    const {getByTestId, findByText} = render(
      <HomePage navigation={{replace: jest.fn()}} />,
    );
    expect(getByTestId('signout-page')).toBeTruthy();
    expect(getByTestId('user-list-modal')).toBeTruthy();

    expect(await findByText('text-Test note')).toBeTruthy();
  });

  it('adds a new note when submitted', async () => {
    const {getByTestId, findByText} = render(
      <HomePage navigation={{replace: jest.fn()}} />,
    );

    fireEvent.press(getByTestId('add-note-form'));

    expect(await findByText('New Note')).toBeTruthy();
  });

  it('deletes a note when delete is clicked', async () => {
    const {getByTestId, queryByText} = render(
      <HomePage navigation={{replace: jest.fn()}} />,
    );
    await waitFor(() => expect(getByTestId('delete-button')).toBeTruthy());

    fireEvent.press(getByTestId('delete-button'));

    await waitFor(() => expect(queryByText('Test note')).toBeNull());
  });

  it('edits a note when edit is clicked', async () => {
    const {getByTestId, findByText} = render(
      <HomePage navigation={{replace: jest.fn()}} />,
    );

    await waitFor(() => expect(getByTestId('edit-button-note-1')).toBeTruthy());

    fireEvent.press(getByTestId('edit-button-note-1'));

    expect(await findByText('text-Content edited')).toBeTruthy();
  });

  it('opens share modal when share is clicked', async () => {
    const {getByTestId} = render(
      <HomePage navigation={{replace: jest.fn()}} />,
    );

    await waitFor(() => expect(getByTestId('share-button')).toBeTruthy());
    fireEvent.press(getByTestId('share-button'));

    expect(getByTestId('user-list-modal')).toBeTruthy();
  });

  it('redirects to login if userInfo is null', () => {
    const mockReplace = jest.fn();
    (useSelector as unknown as jest.Mock).mockReturnValue(null);

    render(<HomePage navigation={{replace: mockReplace}} />);
    expect(mockReplace).toHaveBeenCalledWith(navigationScreenNames.LOGIN);
  });

  it('shows alert if note submission fails', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const mockInsert = jest.fn(() => ({
      select: jest.fn().mockResolvedValue({
        data: [{note_id: null}],
        error: {message: 'Insert failed'},
      }),
    }));

    jest.mocked(supabase.from).mockImplementation(
      () =>
        ({
          insert: mockInsert,
        } as any),
    );

    const {getByTestId} = render(
      <HomePage navigation={{replace: jest.fn()}} />,
    );
    fireEvent.press(getByTestId('add-note-form'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Server Error', 'Insert failed');
    });
  });

  it('shows alert if deleting a note fails', async () => {
    jest.spyOn(fetchNotes, 'fetchUserNotes').mockResolvedValue([
      {
        shared_by_username: 'username',
        content: 'Test note',
        created_at: '',
        id: 'test-note-1',
        profile_id: 'profile1',
        shared_by: 'user1',
        profiles: {
          username: 'username',
        },
      },
    ]);

    const alertSpy = jest.spyOn(Alert, 'alert');

    const mockDelete = jest.fn(() => ({
      eq: jest.fn().mockResolvedValue({
        data: null,
        error: {message: 'Delete failed'},
      }),
    }));

    const mockFrom = jest.fn(() => ({
      delete: mockDelete,
    }));

    const supabaseMock = require('../../../../src/lib/supabase');
    supabaseMock.supabase.from = mockFrom;

    const {getByTestId} = render(
      <HomePage navigation={{replace: jest.fn()}} />,
    );

    await waitFor(() => expect(getByTestId('delete-button')).toBeTruthy());

    fireEvent.press(getByTestId('delete-button'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Server Error', 'Delete failed');
    });
  });

  it('shows alert if edit fails', async () => {
    jest.spyOn(fetchNotes, 'fetchUserNotes').mockResolvedValue([
      {
        shared_by_username: 'username',
        content: 'Test note',
        created_at: '',
        id: 'test-note-1',
        profile_id: 'profile1',
        shared_by: 'user1',
        profiles: {
          username: 'username',
        },
      },
    ]);

    const alertSpy = jest.spyOn(Alert, 'alert');

    const mockEdit = jest.fn(() => ({
      eq: jest.fn(() => ({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: {message: 'Edit failed'},
        }),
      })),
    }));

    const mockFrom = jest.fn(() => ({
      update: mockEdit,
    }));

    const supabaseMock = require('../../../../src/lib/supabase');
    supabaseMock.supabase.from = mockFrom;
    const {getByTestId} = render(
      <HomePage navigation={{replace: jest.fn()}} />,
    );
    await waitFor(() =>
      expect(getByTestId('edit-button-test-note-1')).toBeTruthy(),
    );

    fireEvent.press(getByTestId('edit-button-test-note-1'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Server Error', 'Edit failed');
    });
  });

  it('returns empty array if profile fetch fails', async () => {
    jest.mocked(supabase.from).mockImplementation(
      () =>
        ({
          select: jest
            .fn()
            .mockResolvedValue({data: null, error: {message: 'Fetch error'}}),
        } as any),
    );

    const {getByTestId} = render(
      <HomePage navigation={{replace: jest.fn()}} />,
    );
    await waitFor(() => expect(getByTestId('share-button')).toBeTruthy());

    fireEvent.press(getByTestId('share-button'));
  });
});
