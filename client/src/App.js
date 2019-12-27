import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import { AuthState } from './context/authContext/AuthContext'
import { AlertState } from './context/alertContext/AlertContext'
import { ServiceState } from './context/serviceContext/ServiceContext'
import Site from './Site'
import './sass/main.scss'

const App = () => {
  return (
    <AuthState>
      <AlertState>
        <ServiceState>
          <BrowserRouter>
            <Site />
          </BrowserRouter>
        </ServiceState>
      </AlertState>
    </AuthState>
  )
}

export default App;