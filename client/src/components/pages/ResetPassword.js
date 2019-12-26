import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext/AuthContext'
import { AlertContext } from '../../context/alertContext/AlertContext'
import axios from 'axios'

const ResetPassword = props => {
  const [passwords, setPasswords] = useState({
    password: '',
    password2: ''
  })
  const [msg, setMsg] = useState('Loading...')

  const authContext = useContext(AuthContext)
  const { resetPassword, error, } = authContext

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
    if (error) {
      addAlert(error, "danger")
    }
    if (isAuthenticated) {
      props.history.push('/')
    }
    // eslint-disable-next-line
  }, [props.history, isAuthenticated, error]);

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
    <div>
      {!msg ? (<form onSubmit={handleSubmit}>
        <div><label>Password</label><input type="password" name="password" value={password} onChange={handleInput} required minLength="6" /></div>
        <div><label>Retype password</label><input type="password" name="password2" value={password2} onChange={handleInput} required minLength="6" /></div>
        <input type="submit" />
      </form>) : msg}
    </div>

  );
}

export default ResetPassword;