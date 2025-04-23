/* eslint-disable prettier/prettier */
import React from 'react';
import { render } from '@testing-library/react-native';
import HideTextComponent from '../../../src/components/atoms/HideTextComponent';

describe('HideTextComponent', () => {
  it('renders eye-off when isPasswordHidden is true', () => {
    const { getByText } = render(<HideTextComponent isHidden={true} />);
    expect(getByText('Icon: eye-off')).toBeTruthy();
  });

  it('renders eye when isPasswordHidden is false', () => {
    const { getByText } = render(<HideTextComponent isHidden={false} />);
    expect(getByText('Icon: eye')).toBeTruthy();
  });
});
