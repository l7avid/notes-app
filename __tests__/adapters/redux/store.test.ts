import { store } from "../../../src/adapters/redux/store";
import { loginReducer, logoutReducer } from "../../../src/adapters/redux/reducers/userAuth"; // example action creators

describe('userAuth reducer', () => {
  it('should handle login action', () => {
    store.dispatch(loginReducer({ email: 'testUser' }));
    const state = store.getState();
    expect(state.userData.userData?.email).toBe('testUser');
  });

  it('should handle logout action', () => {
    store.dispatch(logoutReducer());
    const state = store.getState();
    expect(state.userData.userData).toBeFalsy;
  });
});
