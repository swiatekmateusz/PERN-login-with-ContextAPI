import React from 'react';
import { AuthState } from './context/authContext/AuthContext'
import Site from './Site'

const App = () => {
  return (
    <AuthState>
      <Site />
    </AuthState>
  )
}

export default App;