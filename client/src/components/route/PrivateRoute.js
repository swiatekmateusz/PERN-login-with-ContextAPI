import React, { useContext } from 'react';
import { AuthContext } from '../../context/authContext/AuthContext'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext)
  const { isAuthenticated, loading, user, logout } = authContext
  if (user === null || typeof user !== 'object') {
    logout()
  }
  return (
    <Route {...rest} render={props => isAuthenticated && !loading && user !== null & typeof user === 'object' ? (
      <Component {...props} />
    ) : (
        <Redirect to="/login" />
      )} />
  )
}

export default PrivateRoute