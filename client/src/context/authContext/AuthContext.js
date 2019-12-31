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
    action: false,
    emailToResend: null
  }

  const [state, dispatch] = useReducer(authReducer, initialState)

  const registerUser = async user => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    try {
      dispatch({ type: "REGISTERING_START" })
      delete user.password2
      // eslint-disable-next-line
      const res = await axios.post('/api/users', user, config)
      dispatch({ type: "ALERT", payload: "Success, now confirm your email" })
      dispatch({ type: "CLEAR_ALERT" })
      dispatch({ type: "REGISTERING_END" })
    } catch (error) {
      if (error.response.data === "User exists") {
        dispatch({ type: "ERROR_REGISTER", payload: error.response.data })
        dispatch({ type: "CLEAR_ERROR" })
      } else if (error.response.data.errors.length > 0) {
        error.response.data.errors.forEach(error => {
          dispatch({ type: "ERROR_REGISTER", payload: error.msg })
          dispatch({ type: "CLEAR_ERROR" })
        })
      }
      dispatch({ type: "REGISTERING_END" })
    }
  }

  const loginUser = async user => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    try {
      dispatch({ type: "LOGIN_START" })
      const response = await axios.post('/api/auth', user, config)
      dispatch({ type: "SUCCESS_LOGIN", payload: response.data })
      await loadUser()
      dispatch({ type: "LOGIN_END" })
    } catch (error) {
      if (error.response.data === "You have to confirm your email!") {
        dispatch({ type: "SET_RESENDEMAIL", payload: user.email })
      } else {
        dispatch({ type: "REMOVE_RESENDEMAIL" })
      }
      if (error.response.data === "You have to confirm your email!" ||
        error.response.data === "User with that email doesn't exist" ||
        error.response.data === "Invalid password") {
        dispatch({ type: "ERROR_LOGIN", payload: error.response.data })
        dispatch({ type: "CLEAR_ERROR" })
      } else if (error.response.data.errors.length > 0) {
        error.response.data.errors.forEach(error => {
          dispatch({ type: "ERROR_REGISTER", payload: error.msg })
          dispatch({ type: "CLEAR_ERROR" })
        })
      }
      dispatch({ type: "LOGIN_END" })
    }
  }

  const loadUser = async () => {
    dispatch({ type: "START_LOADING" })
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    try {
      const response = await axios.get('/api/auth')
      dispatch({ type: "SUCCESS_LOADUSER", payload: response.data })
    } catch (error) {
      dispatch({ type: "ERROR_LOADUSER", payload: error.response.data })
      dispatch({ type: "CLEAR_ERROR" })
    }
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }

  const endLoading = () => {
    dispatch({ type: "END_LOADING" })
  }

  const clearResendEmail = () => {
    dispatch({ type: "REMOVE_RESENDEMAIL" })
  }

  return (
    <AuthContext.Provider value={{
      token: state.token,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      error: state.error,
      loading: state.loading,
      action: state.action,
      emailToResend: state.emailToResend,
      registerUser,
      loginUser,
      loadUser,
      logout,
      endLoading,
      clearResendEmail
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}
