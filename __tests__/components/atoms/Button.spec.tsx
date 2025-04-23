/* eslint-disable prettier/prettier */
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import Button from '../../../src/components/atoms/Button'; // adjust the path to where your Button is

describe('Button component', () => {
  it('renders correctly with given text', () => {
    const {getByText} = render(<Button btnText="Click Me" />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockFn = jest.fn();
    const {getByText} = render(<Button btnText="Click Me" onPress={mockFn} />);
    fireEvent.press(getByText('Click Me'));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('applies custom styles', () => {
    const customStyle = {backgroundColor: 'red'};
    const customTextStyle = {color: 'yellow'};

    const {getByText} = render(
      <Button
        btnText="Styled"
        btnStyle={customStyle}
        textStyle={customTextStyle}
      />,
    );

    const text = getByText('Styled');
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(customTextStyle)]),
    );
  });
});
