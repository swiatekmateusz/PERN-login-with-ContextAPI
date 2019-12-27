import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/authContext/AuthContext'

const Nav = () => {
  const authContext = useContext(AuthContext)
  const { isAuthenticated, logout } = authContext


  const navLinksGuest = (
    <ul>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
    </ul>
  )
  const navLinkUser = (
    <ul>
      <li>
        <a onClick={() => logout()} href="#!">Logout</a>
      </li>
    </ul>
  )

  return (
    <nav className="main_nav">
      {isAuthenticated ? navLinkUser : navLinksGuest}
    </nav>
  )
};

export default Nav