import '../styles/globals.css'
import { UserProvider } from "../contexts/user-context"
import Navbar from '../components/navbar'
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
          <p style={{width: "100%", textAlign: "center", padding: "10px"}}>V 0.1</p>
      </ThemeProvider>
    </UserProvider>
  )



}

export default MyApp
