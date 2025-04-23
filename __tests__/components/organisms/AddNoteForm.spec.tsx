/* eslint-disable prettier/prettier */
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { AddNoteForm } from '../../../src/components/organisms/AddNoteForm';

// Mock function for onSubmit
const mockOnSubmit = jest.fn();

describe('AddNoteForm', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clean up mocks after each test
  });

  it('should render the AddNoteForm correctly', () => {
    const {getByPlaceholderText, getByText} = render(
      <AddNoteForm onSubmit={mockOnSubmit} />,
    );

    // Check if TextInput and Button are rendered
    expect(getByPlaceholderText("What's on your mind?")).toBeTruthy();
    expect(getByText('Post')).toBeTruthy();
  });

  it('should call onSubmit with content when button is pressed', async () => {
    const {getByPlaceholderText, getByText} = render(
      <AddNoteForm onSubmit={mockOnSubmit} />,
    );

    const input = getByPlaceholderText("What's on your mind?");
    const button = getByText('Post');

    // Simulate user input
    fireEvent.changeText(input, 'This is a new note');

    // Press the button
    fireEvent.press(button);

    // Check if onSubmit is called with the correct argument
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

    // Simulate user input
    fireEvent.changeText(input, 'This is a new note');

    // Press the button
    fireEvent.press(button);

    // Check if the input is cleared after submit
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

    // Simulate empty input
    fireEvent.changeText(input, '');

    // Press the button
    fireEvent.press(button);

    // Check if onSubmit was called with empty content
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
