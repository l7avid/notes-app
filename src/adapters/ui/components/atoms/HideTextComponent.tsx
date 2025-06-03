/* eslint-disable prettier/prettier */
import React from 'react';
import { HideTextComponentProps } from '../../../../application/services/interfaces/HideTextComponentProps';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HideTextComponent: React.FC<
  HideTextComponentProps> = ({isHidden}) => {
  return (
    <>
      <Icon
        name={isHidden ? 'eye' : 'eye-off'}
        size={24}
        color="gray"
      />
    </>
  );
};

export default HideTextComponent;
