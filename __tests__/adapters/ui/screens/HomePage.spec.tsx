/* eslint-disable prettier/prettier */
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { HomePage } from '../../../../src/adapters/ui/screens/HomePage';
import * as fetchNotes from '../../../../src/lib/fetchAllNotes';
// Mocks
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
          onPress={() => props.onEdit('Edited Content')}
          testID="edit-button">
          <Text>Edit</Text>
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
        id: 'test-note-1',
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

    // Waiting for the note to render
    expect(await findByText('Test note')).toBeTruthy();
  });

  it('adds a new note when submitted', async () => {
    const {getByTestId, findByText} = render(
      <HomePage navigation={{replace: jest.fn()}} />,
    );

    // Trigger add note form submission
    fireEvent.press(getByTestId('add-note-form'));

    // Waiting for the new note to appear in the list
    expect(await findByText('New Note')).toBeTruthy();
  });

  it('deletes a note when delete is clicked', async () => {
    const {getByTestId, queryByText} = render(
      <HomePage navigation={{replace: jest.fn()}} />,
    );
    await waitFor(() => expect(getByTestId('delete-button')).toBeTruthy());

    // Trigger delete action
    fireEvent.press(getByTestId('delete-button'));

    // Waiting for the note to be removed from the list
    await waitFor(() => expect(queryByText('Test note')).toBeNull());
  });

  it('edits a note when edit is clicked', async () => {
    const {getByTestId, findByText} = render(
      <HomePage navigation={{replace: jest.fn()}} />,
    );
    await waitFor(() => expect(getByTestId('edit-button')).toBeTruthy());
    // Trigger edit action
    fireEvent.press(getByTestId('edit-button'));

    // Waiting for the edited content to appear
    expect(await findByText('Edited Content')).toBeTruthy();
  });

  it('opens share modal when share is clicked', async () => {
    const {getByTestId} = render(
      <HomePage navigation={{replace: jest.fn()}} />,
    );

    await waitFor(() => expect(getByTestId('share-button')).toBeTruthy());
    // Trigger share action
    fireEvent.press(getByTestId('share-button'));

    // Waiting for the modal to open
    expect(getByTestId('user-list-modal')).toBeTruthy();
  });
});
