import React from 'react'
import { AppContainer } from './src/navigation'
import { AuthProvider } from './src/context/auth/provider'

const App = () => (
  <AuthProvider>
    <AppContainer />
  </AuthProvider>
)

export default App
