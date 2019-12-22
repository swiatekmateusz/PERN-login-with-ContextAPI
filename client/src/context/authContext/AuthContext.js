import React, { createContext, useReducer } from 'react';
import authReducer from './authReducer';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';

export const AuthContext = createContext()

export const AuthState = props => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    user: null,
    error: null,
    loading: true,
  }

  const [state, dispatch] = useReducer(authReducer, initialState)

  const registerUser = async user => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    try {
      delete user.password2
      await axios.post('/api/users', user, config)
      console.log("Success now, cofirm ur mail");
      // Alert
      //dispatch(type:"SUCCES_REGISTER")
    } catch (error) {
      console.log(error.response.data.msg);
      // Alert
      dispatch({ type: "ERROR_REGISTER" })
    }
  }

  const loginUser = async user => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    try {
      const response = await axios.post('/api/auth', user, config)
      console.log(response);
      dispatch({ type: "SUCCESS_LOGIN", payload: response.data })
      loadUser()
    } catch (error) {
      console.log(error.response.data);
      // Alert
      dispatch({ type: "ERROR_LOGIN" })
    }
  }

  const loadUser = async () => {
    dispatch({ type: "START_LOADING" })
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    try {
      const response = await axios.get('/api/auth')
      console.log(response);
      dispatch({ type: "SUCCESS_LOADUSER", payload: response.data })
    } catch (error) {
      console.log(error.response.data.msg);
      // Alert
      dispatch({ type: "ERROR_LOADUSER" })
    }
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }
  const endLoading = () => {
    dispatch({ type: "END_LOADING" })
  }

  return (
    <AuthContext.Provider value={{
      token: state.token,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      error: state.error,
      loading: state.loading,
      registerUser,
      loginUser,
      loadUser,
      logout,
      endLoading
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}
