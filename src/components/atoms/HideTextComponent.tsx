import {View, Text} from 'react-native';
import React from 'react';
import {HideTextComponentProps} from '../../interfaces/HideTextComponentProps'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HideTextComponent: React.FC<HideTextComponentProps> = (isPasswordHidden) => {
  return (
    <>
      <Icon
        name={isPasswordHidden ? 'eye-off' : 'eye'}
        size={24}
        color="gray"
      />
    </>
  );
};

export default HideTextComponent;
