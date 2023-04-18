import { createContext, useReducer } from "react";
import { contextReducer } from "./contextReducer";
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
import axios from "axios";

const initialState = {
  loading: false,
  userInfo: null,
  error: null,
  devices: [],
};

const BASE_URL = "https://api.viznx.in/api/operator";

export const Context = createContext(initialState);
const config = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

const Provider = ({ children }) => {
  const [userState, dispatch] = useReducer(contextReducer, initialState);

  // @actions

  // login

  const login = async (email, password) => {
    try {
      dispatch({ type: REQUEST });

      const res = await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        config
      );
     

      dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data });
    } catch (error) {
      dispatch({
        type: USER_AUTH_FAIL,
      });
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      console.log(error);
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

      const res = await axios.get(`${BASE_URL}/profile`, config);

      console.log(res);
      dispatch({ type: USER_PROFILE_SUCCESS, payload: res.data });
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

  // error remover

  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  const setLoading = (set) => {
    if (set) {
      dispatch({ type: SET_LOADING });
    } else dispatch({ type: CLEAR_LOADING });
  };

  //logout
  const logout = async () => {
    try {
    
      dispatch({ type: USER_LOGOUT_SUCCESS });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: SET_ERROR, payload: err });
    }
  };

  // load devices

  const loadDevices = async () => {
    try {
      dispatch({ type: REQUEST });
      const res = await axios.get(`${BASE_URL}/load-devices`, config);
      console.log(res);
      dispatch({ type: LOAD_DEVICES, payload: res?.data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: SET_ERROR, payload: err });
    }
  };

  //add ad

  /* const addAd = async (obj) => {
    try {
      dispatch({ type: REQUEST });
      const res = await axios.post(`${BASE_URL}/create-queue`, obj, config);
      dispatch({ type: CREATE_QUEUE });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: SET_ERROR, payload: err });
    }
  }; */

  return (
    <Context.Provider
      value={{
        userInfo: userState.userInfo,
        loading: userState.loading,
        error: userState.error,
        userStatus: userState.userStatus,
        devices: userState.devices,
        login,
        clearError,
        loadProfile,
        logout,
        setLoading,
        loadDevices,
/*         addAd,
 */      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
