import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import { AuthState } from './context/authContext/AuthContext'
import { AlertState } from './context/alertContext/AlertContext'
import Site from './Site'

const App = () => {
  return (
    <AuthState>
      <AlertState>
        <BrowserRouter>
          <Site />
        </BrowserRouter>
      </AlertState>
    </AuthState>
  )
}

export default App;