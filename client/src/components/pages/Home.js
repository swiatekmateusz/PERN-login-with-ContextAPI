import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/authContext/AuthContext'

const Home = () => {
  const authContext = useContext(AuthContext)
  const { user, } = authContext
  useEffect(() => {
    console.log("zamontowano");
  }, []);

  return (
    <main>
      <h1>Home Page</h1>
      <h2>Hello {user.name}</h2>
    </main>
  )
};


export default Home;