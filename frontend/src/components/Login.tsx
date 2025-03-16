import { Button, TextField, Typography } from "@mui/material"
import { SyntheticEvent, useState } from "react"
import { userLogin } from "../reducers/userReducer"
import { useAppDispatch } from "../hooks"
import { useNavigate } from "react-router-dom"


const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleLogin = async (event: SyntheticEvent) => {
    event.preventDefault()

    const success = await dispatch(userLogin({username, password}))
    if (success) {
      setUsername('')
      setPassword('')
      navigate('/')
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