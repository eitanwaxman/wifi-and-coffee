import '../styles/globals.css'
import { UserProvider } from "../contexts/user-context"
import Navbar from './navbar'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Manrope } from '@next/font/google'
import Head from 'next/head';

const manrope = Manrope({ subsets: ['latin'] })

const theme = createTheme({
  palette: {
    primary: {
      main: "#783600",
    },
  },

});


function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
          <Navbar />
          <Component {...pageProps} />
      </ThemeProvider>
    </UserProvider>
  )



}

export default MyApp
