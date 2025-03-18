import { Button, TextField, Typography } from "@mui/material"
import { SyntheticEvent, useState } from "react"
import { useAppDispatch } from "../hooks"
import { useMutation } from "@apollo/client"
import { SIGN_IN } from "../graphql/queries/userQueries"
import { notify } from "../reducers/notificationReducer"


const SignIn = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const [signIn] = useMutation(SIGN_IN)

  const handleSignIn = async (event: SyntheticEvent) => {
    event.preventDefault()
    try {
      await signIn({variables: {username, password}})
      setUsername('')
      setPassword('')
      dispatch(notify({severity: "success", message:`Sign In Successful. You can now Login with your credentials`}))
    } catch {
      dispatch(notify({severity: "error", message:`Sign In failed`}))
    }
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