import { createSlice, PayloadAction, ThunkAction, UnknownAction } from '@reduxjs/toolkit'
import { SafeUser } from '../types/user'
import { RootState } from '../store'
import { notify } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null as SafeUser | null,
  reducers: {
    setUser(_state, action: PayloadAction<SafeUser | null>) {
      return action.payload
    },
  },
})

export const { setUser } = userSlice.actions

export const userLogout = (): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch) => {
    window.localStorage.removeItem('recipeapp-userToken')
    dispatch(setUser(null))
    dispatch(notify({ severity: 'success', message: `Logout Successful!` }))
  }
}

export default userSlice.reducer
