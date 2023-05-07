import { createContext, useReducer } from "react";
import { contextReducer } from "./contextReducer";
import io from "socket.io-client";

import {
  CLEAR_ERROR,
  CLEAR_SOCKET,
  REQUEST,
  SET_ERROR,
  SET_SOCKET,
  USER_AUTH_FAIL,
  USER_LOGIN_SUCCESS,
} from "./types";
import axios from "axios";

const initialState = {
  loading: false,
  userInfo: null,
  error: null,
  socket: null,
};

export const Context = createContext(initialState);
const BASE_URL = "https://api.viznx.in/api/device";
const SOCKET_URL = "http://localhost:5000";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

const Provider = ({ children }) => {
  const [userState, dispatch] = useReducer(contextReducer, initialState);

  // @actions

  const setSocket = async () => {
    try {
      console.log("hello");
      if (userState?.userInfo._id) {
        // if already socket connected , no need to connect again
        if (userState?.socket) {
          return;
        } else {
          const socket = io(SOCKET_URL, {
            query: {
              deviceID: userState.userInfo._id,
            },
          });

          if (socket) {
            dispatch({
              type: SET_SOCKET,
              payload: socket,
            });
          }
        }
      }
    } catch (error) {
      dispatch({
        type: CLEAR_SOCKET,
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

  // login

  const login = async (deviceId, password) => {
    try {
      dispatch({ type: REQUEST });

      const res = await axios.post(
        `${BASE_URL}/login`,
        { deviceId, password },
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

      const res = await axios.get(`${BASE_URL}/profile`, config);

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

  // error remover

  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  return (
    <Context.Provider
      value={{
        userInfo: userState.userInfo,
        loading: userState.loading,
        error: userState.error,
        socket: userState.socket,
        login,
        clearError,
        loadProfile,
        setSocket,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
