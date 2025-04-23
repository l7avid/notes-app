/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../../../../src/lib/supabase';
import { logoutReducer } from '../../../../src/adapters/redux/reducers/userAuth';
import SignOutPage from '../../../../src/adapters/ui/screens/SignOutPage'; // Adjust path as needed

jest.mock('@react-native-async-storage/async-storage');
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));
jest.mock('../../../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
    },
  },
}));
jest.mock('../../../../src/adapters/redux/reducers/userAuth', () => ({
  logoutReducer: jest.fn(() => ({type: 'LOGOUT'})),
}));

describe('SignOutPage', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(null);
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({error: null});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls logout, clears AsyncStorage and Supabase on icon press', async () => {
    const {getByTestId } = render(<SignOutPage />);
    const button = getByTestId('sign-out-button');

    fireEvent.press(button);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(logoutReducer());
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        'supabase.auth.token',
      );
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  it('logs error if supabase signOut fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({
      error: {message: 'Logout failed'},
    });

    const {getByTestId } = render(<SignOutPage />);
    const button = getByTestId('sign-out-button');
    fireEvent.press(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error signing out:',
        'Logout failed',
      );
    });

    consoleSpy.mockRestore();
  });

  it('calls console.error when an unexpected error occurs', async () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error

    // Simulate an error in signOut by making it reject
    (supabase.auth.signOut as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Unexpected error'))
    );

    const { getByTestId } = render(<SignOutPage />);
    const button = getByTestId('sign-out-button');

    fireEvent.press(button);

    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith('Unexpected error:', expect.any(Error));
    });

    // Restore console.error after the test
    consoleErrorMock.mockRestore();
  });
});
