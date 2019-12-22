import React, { Fragment, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext/AuthContext'

const Login = props => {
  const [user, setUser] = useState({
    email: '',
    password: ''
  })
  const { email, password } = user

  const authContext = useContext(AuthContext);
  const { isAuthenticated, loginUser } = authContext

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push('/')
    }
  }, [props.history, isAuthenticated]);

  const handleInput = e => setUser({
    ...user,
    [e.target.name]: e.target.value
  })

  const handleSubmit = e => {
    e.preventDefault()
    loginUser(user)
    setUser({
      email: '',
      password: '',
    })
    //Alert confirm email
  }
  return (<Fragment>
    <h1>Login</h1>
    <form onSubmit={handleSubmit}>
      <div><label>Email</label><input type="email" name="email" value={email} onChange={handleInput} required /></div>
      <div><label>Password</label><input type="password" name="password" value={password} onChange={handleInput} required /></div>
      <input type="submit" />
    </form>
  </Fragment>
  )
};


export default Login;