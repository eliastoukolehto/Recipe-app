import { createSlice, PayloadAction, ThunkAction, UnknownAction } from '@reduxjs/toolkit'
import { SafeUser, UserFromInputs } from '../types/user'
import { RootState } from '../store'
import { apolloClient } from '../graphql/apolloClient'
import { LOGIN, SIGN_IN, USER } from '../graphql/queries/userQueries'


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

export const userLogin = (user: UserFromInputs): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async dispatch => {
    const response = await apolloClient.mutate({
      mutation: LOGIN,
      variables: {username: user.username, password: user.password}
    })
    console.log('res1: ',response.data.login.value)
    window.localStorage.setItem('recipeapp-userToken', response.data.login.value)
    dispatch(setUserFromToken())
  }
}

export const userLogout = (): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async dispatch => {
    window.localStorage.removeItem('recipeapp-userToken')
    dispatch(setUser(null))
  }
}

export const userSignIn = (user: UserFromInputs): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async dispatch => {
    await apolloClient.mutate({
      mutation: SIGN_IN,
      variables: {username: user.username, password: user.password}
    })
    dispatch(userLogin(user))
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