import React, { useEffect, useRef } from 'react'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes'
import { useAuth } from '../features/auth/hooks/useAuth'

const App = () => {
  const { handelGetMe } = useAuth()
  const getMe = useRef(handelGetMe)

  useEffect(() => {
    getMe.current()
  }, [])

  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
