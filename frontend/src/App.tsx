import {
  Routes, Route,
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
import { Container, CssBaseline } from '@mui/material'
import { notify } from './reducers/notificationReducer'
import RecipeForm from './components/RecipeForm/RecipeForm'
import RecipePage from './components/RecipePage'

const App = () => {
  const dispatch = useAppDispatch()
  const { refetch: getUser } = useQuery(USER, { skip: true })

  useEffect(() => {
    const initializeUser = async () => {
      const token = window.localStorage.getItem('recipeapp-userToken')
      if (token) {
        try {
          const { data } = await getUser()
          dispatch(setUser(data.me))
        }
        catch {
          dispatch(notify({ severity: 'error', message: `Instance expired, please login again` }))
          window.localStorage.removeItem('recipeapp-userToken')
        }
      }
    }
    initializeUser()
  }, [dispatch, getUser])

  return (
    <>
      <CssBaseline />
      <AppBar />
      <Notification />

      <Container sx={{ padding: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/newrecipe" element={<RecipeForm />} />
          <Route path="/recipes/:recipeId" element={<RecipePage />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
