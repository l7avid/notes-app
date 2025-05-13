import {fireEvent, render} from '@testing-library/react-native';
import React from 'react';
import {Alert} from 'react-native';
import SignUpPage from '../../../../src/adapters/ui/screens/SignUpPage';

describe('SignUpPage', () => {
  const mockNavigation = {navigate: jest.fn(), goBack: jest.fn()};
  const mockRoute = {params: {onSignUp: jest.fn(), loading: false}};

  it('renders correctly', () => {
    const {getByPlaceholderText} = render(
      <SignUpPage navigation={mockNavigation} route={mockRoute} />,
    );

    expect(getByPlaceholderText('Enter your Full Name')).toBeTruthy();
    expect(getByPlaceholderText('Enter your Username')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email address')).toBeTruthy();
    expect(getByPlaceholderText('Create a Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm your Password')).toBeTruthy();
  });

  it('calls onSignUp with correct data when Sign Up button is pressed', () => {
    const {getByPlaceholderText, getByText} = render(
      <SignUpPage navigation={mockNavigation} route={mockRoute} />,
    );

    fireEvent.changeText(
      getByPlaceholderText('Enter your Full Name'),
      'John Doe',
    );
    fireEvent.changeText(
      getByPlaceholderText('Enter your Username'),
      'johndoe',
    );
    fireEvent.changeText(
      getByPlaceholderText('Enter your email address'),
      'john@example.com',
    );
    fireEvent.changeText(
      getByPlaceholderText('Create a Password'),
      'password123',
    );
    fireEvent.changeText(
      getByPlaceholderText('Confirm your Password'),
      'password123',
    );

    fireEvent.press(getByText('Sign Up'));

    expect(mockRoute.params.onSignUp).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'password123',
      options: {data: {username: 'johndoe', full_name: 'John Doe'}},
    });
  });

  it('navigates to login screen when Sign In text is pressed', () => {
    const {getByText} = render(
      <SignUpPage navigation={mockNavigation} route={mockRoute} />,
    );

    fireEvent.press(getByText('Sign In'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('shows error alert if sign up fails', async () => {
    const mockAlert = jest.spyOn(Alert, 'alert');
    const errorMockRoute = {
      params: {
        onSignUp: jest.fn().mockResolvedValue({
          error: {message: 'Email already exists'},
        }),
        loading: false,
      },
    };

    const {getByText, getByPlaceholderText} = render(
      <SignUpPage navigation={mockNavigation} route={errorMockRoute} />,
    );

    fireEvent.changeText(
      getByPlaceholderText('Enter your Full Name'),
      'Jane Doe',
    );
    fireEvent.changeText(
      getByPlaceholderText('Enter your Username'),
      'janedoe',
    );
    fireEvent.changeText(
      getByPlaceholderText('Enter your email address'),
      'jane@example.com',
    );
    fireEvent.changeText(
      getByPlaceholderText('Create a Password'),
      'password123',
    );
    fireEvent.changeText(
      getByPlaceholderText('Confirm your Password'),
      'password123',
    );

    await fireEvent.press(getByText('Sign Up'));

    expect(mockAlert).toHaveBeenCalledWith(
      'Sign Up failed',
      'Email already exists',
    );
  });

  it('goes back when first back button is pressed', () => {
    const {getByTestId} = render(
      <SignUpPage navigation={mockNavigation} route={mockRoute} />,
    );

    const touchable = getByTestId('button');

    fireEvent.press(touchable);
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('goes back when second back button is pressed', () => {
    const {getByTestId} = render(
      <SignUpPage navigation={mockNavigation} route={mockRoute} />,
    );

    const touchable = getByTestId('button-back');

    fireEvent.press(touchable);
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('toggles password visibility', () => {
    const {getByTestId, getByPlaceholderText} = render(
      <SignUpPage navigation={mockNavigation} route={mockRoute} />,
    );

    const passwordInput = getByPlaceholderText('Create a Password');
    expect(passwordInput.props.secureTextEntry).toBe(true);

    const toggleButton = getByTestId('button-password');
    fireEvent.press(toggleButton);

    expect(passwordInput.props.secureTextEntry).toBe(false);
  });

  it('toggles confirm password visibility', () => {
    const {getByTestId, getByPlaceholderText} = render(
      <SignUpPage navigation={mockNavigation} route={mockRoute} />,
    );

    const passwordInput = getByPlaceholderText('Confirm your Password');
    expect(passwordInput.props.secureTextEntry).toBe(true);

    const toggleButton = getByTestId('button-confirm-password');
    fireEvent.press(toggleButton);

    expect(passwordInput.props.secureTextEntry).toBe(false);
  });
});
