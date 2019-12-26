import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/authContext/AuthContext'
import { AlertContext } from '../../context/alertContext/AlertContext'

const SendResetLink = props => {
  const [email, setEmail] = useState('')

  const authContext = useContext(AuthContext)
  const { error, resetPasswordLink, isAuthenticated } = authContext

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

  const handleInput = e => setEmail(e.target.value)

  const handleSubmit = e => {
    e.preventDefault()
    clearAlerts()
    resetPasswordLink(email)
    setEmail('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Type your email to send reset password link</h1>
      <div><label>Email</label><input type="email" name="email" value={email} onChange={handleInput} required /></div>
      <input type="submit" />
    </form>
  );
}

export default SendResetLink;