import { createSlice, PayloadAction, ThunkAction, UnknownAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Notification } from '../types/notification'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { severity: 'info', message: '' },
  reducers: {
    setNotification(_state, action: PayloadAction<Notification>) {
      return action.payload
    },
  },
})

export const { setNotification } = notificationSlice.actions

export const notify = (notification: Notification): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch) => {
    dispatch(setNotification(notification))
  }
}

export const removeNotification = (): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch) => {
    dispatch(setNotification({ severity: 'info', message: '' }))
  }
}

export default notificationSlice.reducer
