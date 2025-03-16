import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer'
import notificationReducer from './reducers/notificationReducer'

export const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer
  }
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']