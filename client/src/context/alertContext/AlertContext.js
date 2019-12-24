import React, { createContext, useReducer } from 'react';
import alertReducer from './alertReducer';

export const AlertContext = createContext()

export const AlertState = props => {
  const initialState = []

  const [state, dispatch] = useReducer(alertReducer, initialState)

  const addAlert = (content, type) => {
    const alert = {
      id: state.length > 0 ? state[state.length - 1].id + 1 : 0,
      content,
      type
    }
    dispatch({ type: "ADD_ALERT", payload: alert })
  }

  const deleteAlert = id => {
    dispatch({ type: "DELETE_ALERT", payload: id })
  }

  const clearAlerts = () => {
    dispatch({ type: "CLEAR_ALERTS" })
  }

  return (
    <AlertContext.Provider value={{
      alerts: state,
      addAlert,
      deleteAlert,
      clearAlerts
    }}>
      {props.children}
    </AlertContext.Provider>
  );
}
