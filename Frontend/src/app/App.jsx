import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes'
import { useAuth } from '../features/auth/hooks/useAuth'
import { useSelector } from 'react-redux'

const App = () => {

  const {handelGetMe}=useAuth()
  const user=useSelector(state=>state.auth.user)
  console.log(user)
  useEffect(()=>{
    handelGetMe()
  },[])
  return <> 
    
    <RouterProvider router={routes}/>
 
  </>
}

export default App
