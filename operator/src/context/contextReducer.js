import {
  CLEAR_ERROR,
  CLEAR_LOADING,
/*   CREATE_QUEUE,
 */  LOAD_DEVICES,
  REQUEST,
  SET_ERROR,
  SET_LOADING,
  USER_AUTH_FAIL,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_SUCCESS,
  USER_PROFILE_SUCCESS,
} from "./types";

export const contextReducer = (state, action) => {
  switch (action.type) {
    case REQUEST:
      return { ...state, loading: true };
    case USER_LOGIN_SUCCESS:
      localStorage.setItem(
        "Viznx_Secure_Session_ID",
        action.payload.Viznx_Secure_Session_ID
      );

      localStorage.setItem(
        "Viznx_operator_Status",
        action.payload.Viznx_operator_Status
      );
      return {
        ...state,
        loading: false,
        userInfo: action.payload,
        error: null,
      };
    case USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        userInfo: action.payload,
        error: null,
      };
    case USER_AUTH_FAIL:
      return { ...state, loading: false, userInfo: null };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_ERROR:
      return { ...state, error: null };
    case USER_LOGOUT_SUCCESS:
      return {
        ...state,
        userInfo: null,
        loading: false,
      };

    case LOAD_DEVICES:
      return {
        ...state,
        loading: false,
        devices: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case CLEAR_LOADING:
      return {
        ...state,
        loading: false,
      };
    /* case CREATE_QUEUE:
      return {
        ...state,
        loading: false,
      }; */
    default:
      return state;
  }
};
