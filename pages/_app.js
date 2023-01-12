import '../styles/globals.css'
import { UserProvider } from "../contexts/user-context"
import Navbar from '../components/navbar'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Manrope } from '@next/font/google'
import Head from 'next/head';
import { LocationProvider } from '../contexts/location-context';
import woodBg from '../public/wood-texture.jpg'

const manrope = Manrope({ subsets: ['latin'] })

const theme = createTheme({
  palette: {
    primary: {
      main: "#783600",
    },
  },
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root:
          ({ ownerState }) => ({
            ...(ownerState.variant === 'contained' &&
            {
              backgroundImage: `url(${woodBg.src})`,
              backgroundSize: "cover",
              fontSize: '1rem',
            })
          }),
      },
    },
  }
});


function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <LocationProvider>
          <Navbar />
          <Component {...pageProps} />
          <p style={{ width: "100%", textAlign: "center", padding: "10px" }}>V 0.8</p>
        </LocationProvider>
      </ThemeProvider>
    </UserProvider>
  )



}

export default MyApp
