import { LOGIN, LOGOUT } from '../actions/types';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = user
  ? { loggedIn: true, user }
  : { loggedIn: false, user: null };

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN:
      return {
        ...state,
        loggedIn: true,
        user: payload.user,
      };

    case LOGOUT:
      return {
        ...state,
        loggedIn: false,
        user: null,
      };
    default:
      return state;
  }
}
