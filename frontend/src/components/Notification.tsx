import { Alert } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../hooks"
import { removeNotification } from "../reducers/notificationReducer";


const Notification = () => {
  const notification = useAppSelector((state) => state.notification)
  const dispatch = useAppDispatch()

  const handleClose = () => {
    dispatch(removeNotification())
  }


  if (!notification.message) return null

  return (
    <Alert severity={
      notification.severity === "error" ? "error" :
      notification.severity === "info" ? "info" : 
      "success"}
      onClose={() => handleClose()}
    >
      {notification.message}
    </Alert>
  )
}

export default Notification