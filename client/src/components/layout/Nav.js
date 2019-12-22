import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/authContext/AuthContext'

const Nav = () => {
  const authContext = useContext(AuthContext)
  const { isAuthenticated, logout } = authContext
  const navLinksGuest = (
    <nav>
      <ul>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  )
  const navLinkUser = (
    <nav>
      <ul>
        <li>
          <a onClick={() => logout()} href="#!">Logout</a>
        </li>
      </ul>
    </nav>
  )

  return isAuthenticated ? navLinkUser : navLinksGuest
};

export default Nav