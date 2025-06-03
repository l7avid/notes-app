/* eslint-disable prettier/prettier */
import React from 'react';
import { Text } from 'react-native';

const MockIcon = ({ name, ...props }) => {
  const iconName = name === 'eye' || name === 'eye-off' ? `Icon: ${name}` : 'Icon: default';
  return <Text {...props}>{iconName}</Text>;
};

export default MockIcon;
