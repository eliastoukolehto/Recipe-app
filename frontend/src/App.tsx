import {
  Routes, Route
} from 'react-router-dom'
import Home from './components/Home'
import AppBar from './components/AppBar'
import Login from './components/Login'
import { useAppDispatch } from './hooks'
import { setUser } from './reducers/userReducer'
import SignIn from './components/SignIn'
import Notification from './components/Notification'
import { useQuery } from '@apollo/client'
import { USER } from './graphql/queries/userQueries'
import { useEffect } from 'react'

const App = () => {
  const dispatch = useAppDispatch()
  const { data } = useQuery(USER)

  useEffect(() => {
      const token = window.localStorage.getItem('recipeapp-userToken')
      if (token && data && data?.me) {
        dispatch(setUser(data.me))
      }
  }, [data, dispatch])



  return (
    <>
      <AppBar/>
      <Notification/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </>
  )
}

export default App
