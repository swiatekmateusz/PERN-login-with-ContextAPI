import React, { Fragment, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext/AuthContext'
import { AlertContext } from '../../context/alertContext/AlertContext'

const Register = props => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })
  const { name, email, password, password2 } = user

  const authContext = useContext(AuthContext);
  const { isAuthenticated, registerUser, error } = authContext

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
    // eslint-disable-next-line
  }, [props.history]);

  const handleInput = e => setUser({
    ...user,
    [e.target.name]: e.target.value
  })

  const handleSubmit = e => {
    e.preventDefault()
    clearAlerts()
    if (password !== password2) {
      addAlert("passwords doesnt match", "danger")
    } else {
      registerUser(user)
      setUser({
        name: '',
        email: '',
        password: '',
        password2: '',
      })
      addAlert("Success, now confirm your email", "Success")
    }
  }

  return (
    <Fragment>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div><label>Name</label><input type="text" name="name" value={name} onChange={handleInput} required /></div>
        <div><label>Email</label><input type="email" name="email" value={email} onChange={handleInput} required /></div>
        <div><label>Password</label><input type="password" name="password" value={password} onChange={handleInput} required /></div>
        <div><label>Retype password</label><input type="password" name="password2" value={password2} onChange={handleInput} required /></div>
        <input type="submit" />
      </form>
    </Fragment>
  )
}


export default Register;