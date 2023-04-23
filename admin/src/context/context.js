import { createContext, useReducer, useState } from "react";
import { contextReducer } from "./contextReducer";
import {
  CLEAR_ERROR,
  REQUEST,
  SET_ERROR,
  USER_AUTH_FAIL,
  USER_LOGIN_SUCCESS,
  SET_LOADING,
  CLEAR_LOADING,
  USER_LOGOUT_SUCCESS,
} from "./types";
import axios from "axios";

const initialState = {
  loading: false,
  userInfo: null,
  error: null,
};

const BASE_URL = "https://api.viznx.in/api/admin";

export const Context = createContext(initialState);
const config = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

const Provider = ({ children }) => {
  const [userState, dispatch] = useReducer(contextReducer, initialState);

  // @actionsti wan

  // login

  const login = async (name, email, password) => {
    try {
      dispatch({ type: REQUEST });

      const res = await axios.post(
        `${BASE_URL}/login`,
        { name, email, password },
        config
      );

      console.log(res);
      dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data });
    } catch (error) {
      dispatch({
        type: USER_AUTH_FAIL,
      });
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      console.log(err);
      dispatch({
        type: SET_ERROR,
        payload: err,
      });
    }
  };

  // load profile

  const loadProfile = async () => {
    try {
      dispatch({ type: REQUEST });

      const res = await axios.get(`${BASE_URL}/load-profile`, config);

      console.log(res);
      dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data });
    } catch (error) {
      dispatch({
        type: USER_AUTH_FAIL,
      });
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      console.log(err);
      dispatch({
        type: SET_ERROR,
        payload: err,
      });
    }
  };

  const setLoading = (set) => {
    if (set) {
      dispatch({ type: SET_LOADING });
    } else dispatch({ type: CLEAR_LOADING });
  };

  // error remover

  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  const logout = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/logout`);
      if (res.status === 200) dispatch({ type: USER_LOGOUT_SUCCESS });
      else throw new Error("Please try again");
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: SET_ERROR, payload: err });
    }
  };

  return (
    <Context.Provider
      value={{
        userInfo: userState.userInfo,
        loading: userState.loading,
        error: userState.error,
        login,
        clearError,
        loadProfile,
        setLoading,
        logOut,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
