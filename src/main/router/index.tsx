import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters'
import { GlobalStyle } from '@/application/styles'
import { AccountContext } from '@/application/contexts'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import React from 'react'
import { PrivateRoute } from '@/main/proxies'

type Props = {
  Login: React.FC
  SignUp: React.FC
  Menu: React.FC
}

export const Router: React.FC<Props> = ({ Login, SignUp, Menu }) => {
  return (
    <AccountContext.Provider value={{ setCurrentAccount: setCurrentAccountAdapter, getCurrentAccount: getCurrentAccountAdapter }}>
      <ToastContainer autoClose={3000} theme="colored" />
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AccountContext.Provider>
  )
}
