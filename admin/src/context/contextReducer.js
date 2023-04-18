import { MdAssignmentReturned } from "react-icons/md";
import {
  CLEAR_ERROR,
  REQUEST,
  SET_ERROR,
  USER_AUTH_FAIL,
  USER_LOGIN_SUCCESS,
  SET_LOADING,
  CLEAR_LOADING
  
} from "./types";

export const contextReducer = (state, action) => {
  switch (action.type) {
    case REQUEST:
      return { ...state, loading: true };
    case USER_LOGIN_SUCCESS:
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
    default:
      return state;
  }
};
