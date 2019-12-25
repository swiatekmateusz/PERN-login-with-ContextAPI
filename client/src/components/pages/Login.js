import React, { Fragment, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext/AuthContext'
import { AlertContext } from '../../context/alertContext/AlertContext'

const Login = props => {
  const [user, setUser] = useState({
    email: '',
    password: ''
  })
  const { email, password } = user

  const authContext = useContext(AuthContext);
  const { isAuthenticated, loginUser, error, resendEmail, emailToResend, clearResendEmail } = authContext

  const alertContext = useContext(AlertContext);
  const { addAlert, clearAlerts } = alertContext

  useEffect(() => {
    if (error) {
      addAlert(error, "danger")
    }
    if (isAuthenticated) {
      props.history.push('/')
    }
    // eslint-disable-next-line
  }, [props.history, isAuthenticated, error]);

  useEffect(() => {
    clearAlerts()
    clearResendEmail()
    // eslint-disable-next-line
  }, [props.history]);

  const handleInput = e => setUser({
    ...user,
    [e.target.name]: e.target.value
  })

  const handleSubmit = e => {
    e.preventDefault()
    clearAlerts()
    loginUser(user)
    setUser({
      email: '',
      password: '',
    })
  }

  const resend = () => {
    resendEmail()
    clearResendEmail()
  }

  return (
    <Fragment>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div><label>Email</label><input type="email" name="email" value={email} onChange={handleInput} required /></div>
        <div><label>Password</label><input type="password" name="password" value={password} onChange={handleInput} required /></div>
        <input type="submit" />
      </form>
      {emailToResend !== null ? <button onClick={resend}>Resend email</button> : null}
    </Fragment>
  )
};


export default Login;