import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/authContext/AuthContext'
import { AlertContext } from '../../context/alertContext/AlertContext'
import { ServiceContext } from '../../context/serviceContext/ServiceContext'

const SendResetLink = props => {
  const [email, setEmail] = useState('')

  const authContext = useContext(AuthContext)
  const { isAuthenticated } = authContext

  const alertContext = useContext(AlertContext);
  const { clearAlerts } = alertContext

  const serviceContext = useContext(ServiceContext);
  const { resetPasswordLink } = serviceContext

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push('/')
    }
    // eslint-disable-next-line
  }, [props.history, isAuthenticated]);

  const handleInput = e => setEmail(e.target.value)

  const handleSubmit = e => {
    e.preventDefault()
    clearAlerts()
    resetPasswordLink(email)
    setEmail('')
  }

  return (
    <div className="auth">
      <form onSubmit={handleSubmit}>
        <h2>Type your email to send reset password link</h2>
        <div className="field"><label>Email</label><input type="email" name="email" value={email} onChange={handleInput} required /></div>
        <input type="submit" />
      </form>
    </div>
  );
}

export default SendResetLink;