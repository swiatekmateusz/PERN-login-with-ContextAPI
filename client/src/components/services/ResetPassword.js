import React, { useState, useEffect, useContext } from 'react';
import { ServiceContext } from '../../context/serviceContext/ServiceContext'
import { AlertContext } from '../../context/alertContext/AlertContext'
import axios from 'axios'

const ResetPassword = props => {
  const [passwords, setPasswords] = useState({
    password: '',
    password2: ''
  })
  const [msg, setMsg] = useState('Loading...')

  const serviceContext = useContext(ServiceContext);
  const { resetPassword } = serviceContext

  const alertContext = useContext(AlertContext);
  const { addAlert, clearAlerts, isAuthenticated } = alertContext

  const { password, password2 } = passwords

  const token = props.match.params.token

  useEffect(() => {
    const checkToken = async () => {
      // eslint-disable-next-line
      const res = await axios.get(`/api/password/check/${token}`)
        .then(() => {
          setMsg('')
        })
        .catch(() => {
          props.history.push('/')
        })
    }
    checkToken()
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push('/')
    }
    // eslint-disable-next-line
  }, [props.history, isAuthenticated]);

  const handleInput = e => setPasswords({
    ...passwords,
    [e.target.name]: e.target.value
  })

  const handleSubmit = e => {
    e.preventDefault()
    clearAlerts()
    if (password !== password2) {
      addAlert("passwords doesnt match", "danger")
    } else {
      resetPassword(password, token)
      setMsg('Back to login page')
      setPasswords({
        password: '',
        password2: ''
      })
    }

  }
  return (
    <div className="auth">
      {!msg ? (<form onSubmit={handleSubmit}>
        <h2>Reset password</h2>
        <div className="field"><label>Password</label><input type="password" name="password" value={password} onChange={handleInput} required minLength="6" /></div>
        <div className="field"><label>Retype password</label><input type="password" name="password2" value={password2} onChange={handleInput} required minLength="6" /></div>
        <input type="submit" />
      </form>) : msg}
    </div>

  );
}

export default ResetPassword;