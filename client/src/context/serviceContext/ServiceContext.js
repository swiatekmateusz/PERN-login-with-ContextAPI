import React, { createContext, useReducer } from 'react';
import serviceReducer from './serviceReducer';
import axios from 'axios';

export const ServiceContext = createContext()

export const ServiceState = props => {
  const initialState = {
    alert: null,
  }

  const [state, dispatch] = useReducer(serviceReducer, initialState)

  const resendEmail = async email => {
    try {
      // uderzenie do API i alert ze pomyslnie resend email, a nasepnie clear przycisku
      const get = await axios.get(`/api/email/resend/${email}`)
      dispatch({ type: "ALERT", payload: get.data })
      dispatch({ type: "CLEAR_ALERT" })
    } catch (error) {
      dispatch({ type: "ALERT", payload: error.response.data })
      dispatch({ type: "CLEAR_ALERT" })
    }
  }

  const resetPasswordLink = async email => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    try {
      // eslint-disable-next-line
      const res = await axios.post('/api/password/reset', { email }, config)
      dispatch({ type: "ALERT", payload: "Success, link sended" })
      dispatch({ type: "CLEAR_ALERT" })
    } catch (error) {
      if (error.response.data) {
        dispatch({ type: "ALERT", payload: error.response.data })
        dispatch({ type: "CLEAR_ALERT" })
      } else if (error.response.data.errors.length > 0) {
        error.response.data.errors.forEach(error => {
          dispatch({ type: "ALERT", payload: error.msg })
          dispatch({ type: "CLEAR_ALERT" })
        })
      }
    }
  }

  const resetPassword = async (password, token) => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    try {
      // eslint-disable-next-line
      const res = await axios.put('/api/password/reset', { password, token }, config)
      dispatch({ type: "ALERT", payload: "Password reseted" })
      dispatch({ type: "CLEAR_ALERT" })
    } catch (error) {
      dispatch({ type: "ALERT", payload: error.response.data })
      dispatch({ type: "CLEAR_ALERT" })
    }
  }

  return (
    <ServiceContext.Provider value={{
      alert: state.alert,
      resendEmail,
      resetPasswordLink,
      resetPassword,
    }}>
      {props.children}
    </ServiceContext.Provider>
  );
}
