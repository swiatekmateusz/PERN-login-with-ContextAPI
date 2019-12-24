import React from 'react';
import { AuthState } from './context/authContext/AuthContext'
import { AlertState } from './context/alertContext/AlertContext'
import Site from './Site'

const App = () => {
  return (
    <AuthState>
      <AlertState>
        <Site />
      </AlertState>
    </AuthState>
  )
}

export default App;