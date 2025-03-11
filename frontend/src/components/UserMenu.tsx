import { Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../hooks"
import { SyntheticEvent, useState } from "react"
import { userLogout } from "../reducers/userReducer"



const UserMenu = () => {
  const user = useAppSelector((state) => state.user)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const dispatch = useAppDispatch()

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }
  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = (event: SyntheticEvent) => {
    event.preventDefault()
    dispatch(userLogout())
  }

  if (!user) return null
  return (
    <>
      <IconButton onClick={handleOpen}>
        <Avatar>{user.username[0]}</Avatar>
      </IconButton>
      <Menu 
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handleClose}
      >
        <Typography>user: {user.username}</Typography>
        <MenuItem onClick={handleLogout} >Logout</MenuItem>
      </Menu>
    </>
  )
}

export default UserMenu