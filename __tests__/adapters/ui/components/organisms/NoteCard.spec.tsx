import {fireEvent, render, waitFor} from '@testing-library/react-native';
import React from 'react';
import NoteCard from '../../../../../src/adapters/ui/components/organisms/NoteCard';

const mockNote = {
  id: '1',
  content: 'This is a test note',
  created_at: '2025-05-05',
  profile_id: '123',
  shared_by: 'username',
  shared_by_username: 'username',
};

describe('NoteCard', () => {
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnShare = jest.fn();

  const setup = (showIcon = true, note = mockNote) => {
    return render(
      <NoteCard
        note={note}
        username="testuser"
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        onShare={mockOnShare}
        showIcon={showIcon}
      />,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders note content and username', () => {
    const {getByText} = setup();

    expect(getByText('This is a test note')).toBeTruthy();
    expect(getByText('testuser')).toBeTruthy();
  });

  test('calls onDelete when delete button is pressed', () => {
    const {getByTestId} = setup();

    fireEvent.press(getByTestId('delete-button'));

    expect(mockOnDelete).toHaveBeenCalled();
  });

  test('calls onEdit with edited content when save button is pressed', () => {
    const {getByPlaceholderText, getByTestId} = setup();

    fireEvent.press(getByTestId('edit-button'));
    fireEvent.changeText(getByPlaceholderText('Edit note'), 'Edited content');
    fireEvent.press(getByTestId('save-button'));

    expect(mockOnEdit).toHaveBeenCalledWith('Edited content');
  });

  test('calls onShare when share button is pressed', async () => {
    const {getByTestId} = setup();

    fireEvent.press(getByTestId('share-button'));

    await waitFor(() => expect(mockOnShare).toHaveBeenCalled());
  });

  test('toggles between edit and view mode', () => {
    const {getByPlaceholderText, getByTestId} = setup();

    fireEvent.press(getByTestId('edit-button'));
    expect(getByPlaceholderText('Edit note')).toBeTruthy();

    fireEvent.changeText(getByPlaceholderText('Edit note'), 'Edited content');
    fireEvent.press(getByTestId('save-button'));
    expect(mockOnEdit).toHaveBeenCalledWith('Edited content');
  });

  test('does not show edit icon when showIcon is false', () => {
    const {queryByText} = setup(false);

    expect(queryByText('edit')).toBeNull();
  });
});
