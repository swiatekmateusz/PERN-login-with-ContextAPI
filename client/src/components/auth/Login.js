import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext/AuthContext'
import { AlertContext } from '../../context/alertContext/AlertContext'
import { ServiceContext } from '../../context/serviceContext/ServiceContext'
import { Link } from 'react-router-dom'

const Login = props => {
  const [user, setUser] = useState({
    email: '',
    password: ''
  })
  const { email, password } = user

  const authContext = useContext(AuthContext);
  const { isAuthenticated, loginUser, action } = authContext

  const alertContext = useContext(AlertContext);
  const { clearAlerts } = alertContext

  const serviceContext = useContext(ServiceContext);
  const { clearResendEmail, emailToResend, resendEmail } = serviceContext

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push('/')
    }
    // eslint-disable-next-line
  }, [props.history, isAuthenticated]);

  useEffect(() => {
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
    <div className="auth">
      {!action ? (
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="field"><label>Email</label><input type="email" name="email" value={email} onChange={handleInput} required /></div>
          <div className="field"><label>Password</label><input type="password" name="password" value={password} onChange={handleInput} required /></div>
          <input type="submit" value="Log in" />
          {emailToResend !== null ? <button onClick={resend}>Resend email</button> : null}
          <Link to="/reset">Did you forget password?</Link>
        </form>
      ) : "Loading..."}
    </div>
  )
};


export default Login;