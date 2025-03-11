import {
  Routes, Route
} from 'react-router-dom'
import Home from './components/Home'
import AppBar from './components/AppBar'
import Login from './components/Login'
import { useAppDispatch } from './hooks'
import { setUserFromToken } from './reducers/userReducer'
import SignIn from './components/SignIn'

const App = () => {
  const dispatch = useAppDispatch()
  dispatch(setUserFromToken())


  return (
    <>
      <AppBar/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </>
  )
}

export default App
