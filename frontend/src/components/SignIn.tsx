import { Button, TextField, Typography, Grid2 as Grid } from "@mui/material"
import { useAppDispatch } from "../hooks"
import { useMutation } from "@apollo/client"
import { SIGN_IN } from "../graphql/queries/userQueries"
import { notify } from "../reducers/notificationReducer"
import * as Yup from "yup"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"

interface values {
  username: string
  password: string
  passwordConfirmation: string
}

//validators
const usernameWhitelist = /^[a-zA-Z0-9_-]+$/
const lowercaseRegEx = /(?=.*[a-z])/
const uppercaseRegEx = /(?=.*[A-Z])/
const numbersRegEx = /(?=.*[0-9])/


const SignIn = () => {
  const dispatch = useAppDispatch()
  const [signIn] = useMutation(SIGN_IN)
  const navigate = useNavigate()

  const handleSignIn = async (values: values) => {
    const {username, password} = values
    try {
      await signIn({variables: {username, password}})
      dispatch(notify({severity: "success", message:`Sign In Successful. You can now Login with your credentials`}))
      navigate('/login')
    } catch {
      dispatch(notify({severity: "error", message:`Sign In failed. Username might be taken`}))
    }
  } 

    const initialValues = {
      username: "",
      password: "",
      passwordConfirmation: ""
    }
  
    const validationSchema = Yup.object().shape({
      username: Yup.string()
        .required("Required")
        .matches(usernameWhitelist, "Username has forbidden characters")
        .min(3, "Username must be at least 3 characters")
        .max(14, "Username is too long"),
      password: Yup.string()
        .required("Required")
        .min(8, "Password must be at least 8 characters")
        .max(30, "Password is too long")
        .matches(lowercaseRegEx, "Password must contain at least one lowercase letter")
        .matches(uppercaseRegEx, "Password must contain at least one uppercase letter")
        .matches(numbersRegEx, "Password must contain at least one number"),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .required("Required")
    })

    const formik = useFormik({
      initialValues,
      validationSchema,
      onSubmit: handleSignIn
    })


  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container direction="column" spacing={2}>
          <Grid size={12}>
            <Typography>Sign In</Typography>
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
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                label="Confirm password" 
                name="passwordConfirmation"
                type="password"
                fullWidth
                value={formik.values.passwordConfirmation}
                onChange={formik.handleChange}
                error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
                helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                />
            </Grid>
            <Grid>
              <Button type="submit" variant="contained">
                Sign In
              </Button>
            </Grid>
          </Grid>
      </form>
    </>
  )

}

export default SignIn