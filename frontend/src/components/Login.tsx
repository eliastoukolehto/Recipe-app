import { Button, TextField, Typography } from "@mui/material"
import { SyntheticEvent, useState } from "react"
import { useAppDispatch } from "../hooks"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@apollo/client"
import { LOGIN, USER } from "../graphql/queries/userQueries"
import { notify } from "../reducers/notificationReducer"
import { setUser } from "../reducers/userReducer"


const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [login] = useMutation(LOGIN)
  const {refetch} = useQuery(USER)

  const handleLogin = async (event: SyntheticEvent) => {
    event.preventDefault()
    try {
      const { data } = await login({variables: {username, password}})
      window.localStorage.setItem('recipeapp-userToken', data.login.value)
      const { data: userData } = await refetch()
      dispatch(setUser(userData.me))
      dispatch(notify({severity: "success", message:`Login Successful!`}))
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      dispatch(notify({severity: "error", message:`Login failed`}))
    }
  }

  return (
    <>
      <form onSubmit={handleLogin}>
        <Typography>Login</Typography>
        <TextField label="username" value={username} onChange={({ target }) => setUsername(target.value)}/>
        <TextField label="password" value={password} type="password" onChange={({ target }) => setPassword(target.value)}/>
        <Button type="submit">Login</Button>   
      </form>
    </>
  )

}

export default Login