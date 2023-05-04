import { createContext, useReducer } from "react";
import { contextReducer } from "./contextReducer";
import {
  CLEAR_ERROR,
  CLEAR_LOADING,
  /*   CREATE_QUEUE,
   */ LOAD_DEVICES,
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
};

const BASE_URL = process.env.REACT_APP_BASE_URL;

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

  // load devices

  /* const loadDevices = async () => {
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
  }; */

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

  const getTimeSlot = (slot) => {
    switch (slot) {
      case "slotone":
      case "slot1":
        return "9-10 A.M";
      case "slottwo":
      case "slot2":
        return "10-11 A.M";
      case "slotthree":
      case "slot3":
        return "11-12 A.M";
      case "slotfour":
      case "slot4":
        return "12-13 P.M";
      case "slotfive":
      case "slot5":
        return "13-14 P.M";
      case "slotsix":
      case "slot6":
        return "14-15 P.M";
      case "slotseven":
      case "slot7":
        return "15-16 P.M";
      case "sloteight":
      case "slot8":
        return "16-17 P.M";
      case "slotnine":
      case "slot9":
        return "17-18 P.M";
      case "slotten":
      case "slot10":
        return "19-20 P.M";
      case "sloteleven":
      case "slot11":
        return "20-21 P.M";
      case "slottwelve":
      case "slot12":
        return "21-22 P.M";
      case "slotthirteen":
      case "slot13":
        return "22-23 P.M";
      case "slotfourteen":
      case "slot14":
        return "23-24 P.M";
      default:
        break;
    }
  };
  return (
    <Context.Provider
      value={{
        userInfo: userState.userInfo,
        loading: userState.loading,
        error: userState.error,
        userStatus: userState.userStatus,
        login,
        clearError,
        loadProfile,
        logout,
        setLoading,
        /*         loadDevices,
         */
        /*         addAd,
         */
        getTimeSlot,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
