import {render} from '@testing-library/react-native';
import Route from '../../../src/adapters/navigations/Route';

jest.mock('../../../src/adapters/navigations/ScreenStack', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return () => <Text>Mocked ScreenStack Content</Text>;
});

describe('Route', () => {
  it('renders the MainStack (ScreenStack) inside NavigationContainer', () => {
    const {getByText} = render(<Route />);
    expect(getByText('Mocked ScreenStack Content')).toBeTruthy();
  });
});
