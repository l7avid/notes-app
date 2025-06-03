/* eslint-disable prettier/prettier */
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { AddNoteForm } from '../../../../../src/adapters/ui/components/organisms/AddNoteForm';

const mockOnSubmit = jest.fn();

describe('AddNoteForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the AddNoteForm correctly', () => {
    const {getByPlaceholderText, getByText} = render(
      <AddNoteForm onSubmit={mockOnSubmit} />,
    );

    expect(getByPlaceholderText("What's on your mind?")).toBeTruthy();
    expect(getByText('Post')).toBeTruthy();
  });

  it('should call onSubmit with content when button is pressed', async () => {
    const {getByPlaceholderText, getByText} = render(
      <AddNoteForm onSubmit={mockOnSubmit} />,
    );

    const input = getByPlaceholderText("What's on your mind?");
    const button = getByText('Post');

    fireEvent.changeText(input, 'This is a new note');

    fireEvent.press(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('This is a new note');
    });
  });

  it('should clear the input after submitting', async () => {
    const {getByPlaceholderText, getByText} = render(
      <AddNoteForm onSubmit={mockOnSubmit} />,
    );

    const input = getByPlaceholderText("What's on your mind?");
    const button = getByText('Post');

    fireEvent.changeText(input, 'This is a new note');

    fireEvent.press(button);

    await waitFor(() => {
      expect(getByPlaceholderText("What's on your mind?").props.value).toBe('');
    });
  });

  it('should not call onSubmit if content is empty', async () => {
    const {getByText, getByPlaceholderText} = render(
      <AddNoteForm onSubmit={mockOnSubmit} />,
    );

    const input = getByPlaceholderText("What's on your mind?");
    const button = getByText('Post');

    fireEvent.changeText(input, '');

    fireEvent.press(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
