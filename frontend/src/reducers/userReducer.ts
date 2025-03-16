import { createSlice, PayloadAction, ThunkAction, UnknownAction } from '@reduxjs/toolkit'
import { SafeUser, UserFromInputs } from '../types/user'
import { RootState } from '../store'
import { apolloClient } from '../graphql/apolloClient'
import { LOGIN, SIGN_IN, USER } from '../graphql/queries/userQueries'
import { notify } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null as SafeUser | null,
  reducers: {
    setUser(_state, action: PayloadAction<SafeUser | null>) {
      return action.payload
    }
  }
})

export const { setUser } = userSlice.actions

export const userLogin = (user: UserFromInputs): ThunkAction<Promise<boolean>, RootState, unknown, UnknownAction> => {
  return async dispatch => {
    const response = await apolloClient.mutate({
      mutation: LOGIN,
      variables: {username: user.username, password: user.password},
      errorPolicy: "all"
    })
    if (response.errors) {
      const message = response.errors?.[0]?.message
      dispatch(notify({severity: "error", message:`Login failed. Message: ${message}`}))
      return false
    } else {
      window.localStorage.setItem('recipeapp-userToken', response.data.login.value)
      dispatch(setUserFromToken())
      dispatch(notify({severity: "success", message:`Login Successful!`}))
      return true
    }
  }
}

export const userLogout = (): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async dispatch => {
    window.localStorage.removeItem('recipeapp-userToken')
    dispatch(setUser(null))
    dispatch(notify({severity: "success", message:`Logout Successful!`}))
  }
}

export const userSignIn = (user: UserFromInputs): ThunkAction<Promise<boolean>, RootState, unknown, UnknownAction> => {
  return async dispatch => {
    const response = await apolloClient.mutate({
      mutation: SIGN_IN,
      variables: {username: user.username, password: user.password},
      errorPolicy: "all"
    })
    if (response.errors) {
      const message = response.errors?.[0]?.message
      dispatch(notify({severity: "error", message:`Sign in failed. Message: ${message}`}))
      return false
    } else {
      dispatch(notify({severity: "success", message:`Sign In Successful. You can now Login with your credentials`}))
      return true
    }
  }
}

export const setUserFromToken = (): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async dispatch => {
    const userToken = window.localStorage.getItem('recipeapp-userToken')
    if (!userToken) dispatch(setUser(null))
    else {
      const response = await apolloClient.query({ query: USER })
      dispatch(setUser(response.data.me))
    }
  }
}

export default userSlice.reducer