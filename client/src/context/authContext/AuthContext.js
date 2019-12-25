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
    emailToResend: null,
  }

  const [state, dispatch] = useReducer(authReducer, initialState)

  const registerUser = async user => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    try {
      delete user.password2
      // eslint-disable-next-line
      const res = await axios.post('/api/users', user, config)
    } catch (error) {
      if (error.response.data.msg) {
        dispatch({ type: "ERROR_REGISTER", payload: error.response.data.msg })
      } else if (error.response.data.errors.length > 0) {
        error.response.data.errors.forEach(error => {
          dispatch({ type: "ERROR_REGISTER", payload: error.msg })
          dispatch({ type: "CLEAR_ERROR" })
        })
      }
    }
  }

  const loginUser = async user => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    try {
      const response = await axios.post('/api/auth', user, config)
      dispatch({ type: "SUCCESS_LOGIN", payload: response.data })
      loadUser()
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data === "You have to confirm your email!") {
        dispatch({ type: "SET_RESENDEMAIL", payload: user.email })
      } else {
        dispatch({ type: "REMOVE_RESENDEMAIL" })
      }
      dispatch({ type: "ERROR_LOGIN", payload: error.response.data })
      dispatch({ type: "CLEAR_ERROR" })
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
      console.log(error.response.data.msg);
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

  const resendEmail = async () => {
    try {
      // uderzenie do API i alert ze pomyslnie resend email, a nasepnie clear przycisku
      const get = await axios.get(`/api/email/resend/${state.emailToResend}`)
      dispatch({ type: "ALERT", payload: get.data })
      dispatch({ type: "CLEAR_ALERT" })
    } catch (error) {
      console.log(error);
      dispatch({ type: "ERROR_LOGIN", payload: error.response.data })
      dispatch({ type: "CLEAR_ERROR" })
    }
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
      emailToResend: state.emailToResend,
      registerUser,
      loginUser,
      loadUser,
      logout,
      endLoading,
      resendEmail,
      clearResendEmail
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}
