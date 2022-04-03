import { createTheme } from "@mui/material/styles"
import { red } from "@mui/material/colors"

// Create a theme instance.
const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121414',
      paper: '#121414',
    },
    text: {
      primary: '#ffffff',
    },
  },
  props: {
    MuiAppBar: {
      color: 'transparent',
    },
  },
})

export default theme
