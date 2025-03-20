import { createTheme } from "@mui/material"

export const theme = createTheme({

  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: "60px"
        }
      }
    }
  }

})