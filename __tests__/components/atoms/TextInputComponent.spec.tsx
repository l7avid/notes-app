/* eslint-disable prettier/prettier */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TextInputComponent from '../../../src/components/atoms/TextInputComponent';

describe('TextInputComponent', () => {
  it('renders with a placeholder', () => {
    const { getByPlaceholderText } = render(
      <TextInputComponent placeholder="Enter name" />
    );
    expect(getByPlaceholderText('Enter name')).toBeTruthy();
  });

  it('displays the correct value', () => {
    const { getByDisplayValue } = render(
      <TextInputComponent value="Hello" />
    );
    expect(getByDisplayValue('Hello')).toBeTruthy();
  });

  it('calls onChangeText when text is entered', () => {
    const mockFn = jest.fn();
    const { getByPlaceholderText } = render(
      <TextInputComponent placeholder="Type something" onChangeText={mockFn} />
    );
    const input = getByPlaceholderText('Type something');
    fireEvent.changeText(input, 'Test input');
    expect(mockFn).toHaveBeenCalledWith('Test input');
  });

  it('sets secureTextEntry when passed', () => {
    const { getByPlaceholderText } = render(
      <TextInputComponent placeholder="Password" secureTextEntry={true} />
    );
    const input = getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('sets keyboardType when passed', () => {
    const { getByPlaceholderText } = render(
      <TextInputComponent placeholder="Email" keyboardType="email-address" />
    );
    const input = getByPlaceholderText('Email');
    expect(input.props.keyboardType).toBe('email-address');
  });

  it('applies custom marginBottom style', () => {
    const { getByPlaceholderText } = render(
      <TextInputComponent placeholder="Custom margin" marginBottom={42} />
    );
    const input = getByPlaceholderText('Custom margin');
    expect(input.props.style.marginBottom).toBe(42);
  });
});
