/* eslint-disable prettier/prettier */
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import LoginPage from '../../../../src/adapters/ui/screens/LoginPage'; // Adjust path as needed
import navigationScreenNames from '../../../../src/utils/constants/navigationScreenNames';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

const mockNavigation = {
  replace: jest.fn(),
  navigate: jest.fn(),
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(false);

    const {getByPlaceholderText, getByText} = render(
      <LoginPage
        navigation={mockNavigation}
        route={{params: {onLogin: jest.fn(), loading: false}}}
      />,
    );

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText(/don't have an account/i)).toBeTruthy();
  });

  it('calls onLogin with correct credentials', () => {
    const onLoginMock = jest.fn();
    (useSelector as unknown as jest.Mock).mockReturnValue(false);

    const {getByPlaceholderText, getByText} = render(
      <LoginPage
        navigation={mockNavigation}
        route={{params: {onLogin: onLoginMock, loading: false}}}
      />,
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');
    fireEvent.press(getByText('Sign In'));

    expect(onLoginMock).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: '123456',
    });
  });

  it('navigates to home if already authenticated', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(true);

    render(
      <LoginPage
        navigation={mockNavigation}
        route={{params: {onLogin: jest.fn(), loading: false}}}
      />,
    );

    expect(mockNavigation.replace).toHaveBeenCalledWith(navigationScreenNames.HOME);
  });

  it('navigates to signup page on Sign Up press', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(false);

    const {getByText} = render(
      <LoginPage
        navigation={mockNavigation}
        route={{params: {onLogin: jest.fn(), loading: false}}}
      />,
    );

    fireEvent.press(getByText('Sign Up'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(navigationScreenNames.SIGNUP);
  });
});
