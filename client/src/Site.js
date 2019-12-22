import React, { useContext, useEffect, Fragment } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from './components/pages/Home'
import Register from './components/pages/Register'
import Login from './components/pages/Login'
import Nav from './components/layout/Nav'
import { AuthContext } from './context/authContext/AuthContext'
import PrivateRoute from './components/route/PrivateRoute'
import ConfirmEmail from './components/pages/ConfirmEmail'

const Site = () => {
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
  return (
    <BrowserRouter>
      {!loading ? (
        <Fragment>
          <Nav />
          <div className="container">
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/confirm/:token" component={ConfirmEmail} />
            </Switch>
          </div>
        </Fragment>) : 'Loading...'}
    </BrowserRouter>);
}

export default Site;