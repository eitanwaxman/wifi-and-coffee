import '../styles/globals.css'
import { UserProvider } from "../contexts/user-context"
import Navbar from '../components/navbar'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Manrope } from '@next/font/google'
import Head from 'next/head';
import { LocationProvider } from '../contexts/location-context';

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
        <LocationProvider>
          <Navbar />
          <Component {...pageProps} />
          <p style={{ width: "100%", textAlign: "center", padding: "10px" }}>V 0.3</p>
        </LocationProvider>
      </ThemeProvider>
    </UserProvider>
  )



}

export default MyApp
