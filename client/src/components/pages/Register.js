import React, { Fragment, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext/AuthContext'

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

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push('/')
    }
    if (error) {
      //set alert
    }
  }, [props.history, isAuthenticated, error]);

  const handleInput = e => setUser({
    ...user,
    [e.target.name]: e.target.value
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (password !== password2) {
      console.log("passwords doesnt match");
    } else {
      registerUser(user)
      setUser({
        name: '',
        email: '',
        password: '',
        password2: '',
      })
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