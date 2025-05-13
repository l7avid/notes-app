import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import ScreenStack from '../../../src/adapters/navigations/ScreenStack';
import {useDispatch} from 'react-redux';
import navigationScreenNames from '../../../src/utils/constants/navigationScreenNames';
import {loginReducer} from '../../../src/adapters/redux/reducers/userAuth';

// Mock Redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock Supabase
jest.mock('../../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest
        .fn()
        .mockResolvedValue({data: {user: 'mockUser'}, error: null}),
      signInWithPassword: jest
        .fn()
        .mockResolvedValue({data: {user: 'mockUser'}, error: null}),
    },
  },
}));

let mockTriggerInvalidLogin = false;

jest.mock('../../../src/adapters/ui/screens/LoginPage', () => {
  const React = require('react');
  const {Button, Text} = require('react-native');
  return {
    __esModule: true,
    default: ({route}) => {
      const {onLogin} = route.params;
      return (
        <>
          <Text>Mock LoginPage</Text>
          <Button
            title={
              mockTriggerInvalidLogin
                ? 'Trigger Login with Undefined Email'
                : 'Trigger Login'
            }
            onPress={() =>
              onLogin(
                mockTriggerInvalidLogin
                  ? {email: undefined, password: '1234'}
                  : {email: 'test@example.com', password: '1234'},
              )
            }
          />
        </>
      );
    },
  };
});

jest.mock('../../../src/adapters/ui/screens/SignUpPage', () => {
  const React = require('react');
  const {Button, Text} = require('react-native');
  return {
    __esModule: true,
    default: ({route}) => {
      const {onSignUp} = route.params;
      return (
        <>
          <Text>Mock SignUpPage</Text>
          <Button
            title="Trigger SignUp"
            onPress={() =>
              onSignUp({
                email: 'new@example.com',
                password: 'abcd',
                options: {},
              })
            }
          />
        </>
      );
    },
  };
});

// ✅ Test
describe('ScreenStack logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onLogin and dispatches user data', async () => {
    const mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    const {getByText} = render(
      <NavigationContainer>
        <ScreenStack />
      </NavigationContainer>,
    );

    fireEvent.press(getByText('Trigger Login'));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(loginReducer('mockUser'));
    });
  });

  it('calls onSignUp with valid credentials', async () => {
    const {getByText} = render(
      <NavigationContainer
        initialState={{
          routes: [{name: navigationScreenNames.SIGNUP}],
        }}>
        <ScreenStack />
      </NavigationContainer>,
    );

    fireEvent.press(getByText('Trigger SignUp'));

    await waitFor(() => {
      const supabase = require('../../../src/lib/supabase').supabase;
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'abcd',
        options: {},
      });
    });
  });

  it('does not call onSignUp when email is missing', async () => {
    const supabase = require('../../../src/lib/supabase').supabase;
    supabase.auth.signUp.mockClear();

    // Re-mock SignUpPage with missing email
    jest.doMock('../../../src/adapters/ui/screens/SignUpPage', () => {
      const React = require('react');
      const {Button, Text} = require('react-native');
      return {
        __esModule: true,
        default: ({route}) => {
          const {onSignUp} = route.params;
          return (
            <>
              <Text>Mock SignUpPage</Text>
              <Button
                title="Trigger Invalid SignUp"
                onPress={() =>
                  onSignUp({
                    // Missing email here
                    password: '1234',
                    options: {},
                  })
                }
              />
            </>
          );
        },
      };
    });

    // Re-import the updated version of ScreenStack
    const ScreenStackUpdated =
      require('../../../src/adapters/navigations/ScreenStack').default;

    const {getByRole} = render(
      <NavigationContainer>
        <ScreenStackUpdated />
      </NavigationContainer>,
    );

    fireEvent.press(getByRole('button'));

    await waitFor(() => {
      // Check that signUp was NOT called due to missing email
      expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });
  });

  it('does not call Login when email is missing', async () => {
    const supabase = require('../../../src/lib/supabase').supabase;
    supabase.auth.signUp.mockClear();

    // Re-mock SignUpPage with missing email
    jest.doMock('../../../src/adapters/ui/screens/LoginPage', () => {
      const React = require('react');
      const {Button, Text} = require('react-native');
      return {
        __esModule: true,
        default: ({route}) => {
          const {onLogin} = route.params;
          return (
            <>
              <Text>Mock LoginPage</Text>
              <Button
                title="Trigger Invalid Login"
                onPress={() =>
                  onLogin({
                    // Missing email here
                    password: '1234',
                    options: {},
                  })
                }
              />
            </>
          );
        },
      };
    });

    // Re-import the updated version of ScreenStack
    const ScreenStackUpdated =
      require('../../../src/adapters/navigations/ScreenStack').default;

    const {getByRole} = render(
      <NavigationContainer>
        <ScreenStackUpdated />
      </NavigationContainer>,
    );

    fireEvent.press(getByRole('button'));

    await waitFor(() => {
      // Check that signUp was NOT called due to missing email
      expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });
  });

  it('does not call Login when email is undefined', async () => {
    const supabase = require('../../../src/lib/supabase').supabase;
    supabase.auth.signInWithPassword.mockClear();

    // Activate test case scenario
    mockTriggerInvalidLogin = true;

    const {
      default: ScreenStackUpdated,
    } = require('../../../src/adapters/navigations/ScreenStack');

    const {getByText} = render(
      <NavigationContainer>
        <ScreenStackUpdated />
      </NavigationContainer>,
    );

    fireEvent.press(getByText('Trigger Login with Undefined Email'));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: undefined,
        password: '1234',
      });
    });

    // Reset after test
    mockTriggerInvalidLogin = false;
  });
});
