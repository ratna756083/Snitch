import React from 'react'
import { RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import { routes } from './app.routes'

const App = ({ store }) => {
  return <> 
  <Provider store={store}>
    <RouterProvider router={routes}/>
  </Provider>
  </>
}

export default App
