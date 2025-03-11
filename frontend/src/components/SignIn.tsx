import { Button, TextField, Typography } from "@mui/material"
import { SyntheticEvent, useState } from "react"
import { userSignIn } from "../reducers/userReducer"
import { useAppDispatch } from "../hooks"


const SignIn = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()

  const handleSignIn = (event: SyntheticEvent) => {
    event.preventDefault()
    dispatch(userSignIn({username, password}))
    setUsername('')
    setPassword('')
  }

  return (
    <>
      <form onSubmit={handleSignIn}>
        <Typography>Sign In</Typography>
        <TextField label="username" value={username} onChange={({ target }) => setUsername(target.value)}/>
        <TextField label="password" value={password} type="password" onChange={({ target }) => setPassword(target.value)}/>
        <Button type="submit">Sign In</Button>   
      </form>
    </>
  )

}

export default SignIn