import { Button, TextField, Typography } from "@mui/material"
import { SyntheticEvent, useState } from "react"
import { userLogin } from "../reducers/userReducer"
import { useAppDispatch } from "../hooks"


const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()

  const handleLogin = (event: SyntheticEvent) => {
    event.preventDefault()
    dispatch(userLogin({username, password}))
    setUsername('')
    setPassword('')
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