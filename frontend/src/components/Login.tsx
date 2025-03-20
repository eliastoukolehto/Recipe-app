import { Button, Grid2 as Grid, TextField, Typography } from "@mui/material"
import { useAppDispatch } from "../hooks"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@apollo/client"
import { LOGIN, USER } from "../graphql/queries/userQueries"
import { notify } from "../reducers/notificationReducer"
import { setUser } from "../reducers/userReducer"
import * as Yup from "yup"
import { useFormik } from "formik"

interface values {
  username: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [login] = useMutation(LOGIN)
  const {refetch} = useQuery(USER)

  const handleLogin = async (values: values) => {
    const {username, password} = values
    try {
      const { data } = await login({variables: {username, password}})
      window.localStorage.setItem('recipeapp-userToken', data.login.value)
      const { data: userData } = await refetch()
      dispatch(setUser(userData.me))
      dispatch(notify({severity: "success", message:`Login Successful!`}))
      navigate('/')
    } catch {
      dispatch(notify({severity: "error", message:`Login failed`}))
    }
  }

  const initialValues = {
    username: "",
    password: ""
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleLogin
  })

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container direction="column" spacing={2}>
          <Grid size={12}>
            <Typography>Login</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              label="Username" 
              name="username"
              fullWidth
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              label="Password" 
              name="password"
              type="password"
              fullWidth
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.password)}
              helperText={formik.touched.username && formik.errors.password}
              />
          </Grid>
          <Grid>
            <Button type="submit" disabled={Boolean(formik.errors.username) || Boolean(formik.errors.username)}>
              Login
            </Button>
          </Grid>
        </Grid>
      </form>

    </>
  )

}

export default Login