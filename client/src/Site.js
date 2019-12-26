import React, { useContext, useEffect, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom'
import Home from './components/pages/Home'
import Register from './components/pages/Register'
import Login from './components/pages/Login'
import Nav from './components/layout/Nav'
import { AuthContext } from './context/authContext/AuthContext'
import PrivateRoute from './components/route/PrivateRoute'
import ConfirmEmail from './components/pages/ConfirmEmail'
import SendResetLink from './components/pages/SendResetLink'
import ResetPassword from './components/pages/ResetPassword'
import Alerts from './components/layout/Alerts'
import { withRouter } from 'react-router-dom';
import { AlertContext } from './context/alertContext/AlertContext'

const Site = props => {
  const authContext = useContext(AuthContext);
  const { loadUser, endLoading, loading } = authContext
  useEffect(() => {
    if (localStorage.token) {
      loadUser()
    } else {
      endLoading()
    }
    // eslint-disable-next-line
  }, []);

  const alertContext = useContext(AlertContext);
  const { clearAlerts } = alertContext

  useEffect(() => {
    clearAlerts()
    // eslint-disable-next-line
  }, [props.location]);

  return (
    <Fragment>
      {!loading ? (
        <Fragment>
          <Nav />
          <div className="container">
            <Alerts />
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/confirm/:token" component={ConfirmEmail} />
              <Route exact path="/reset" component={SendResetLink} />
              <Route exact path="/reset/:token" component={ResetPassword} />
            </Switch>
          </div>
        </Fragment>
      ) : 'Loading...'}
    </Fragment>
  )
}

export default withRouter(Site);