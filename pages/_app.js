import '../styles/globals.css'
import { UserProvider } from "../contexts/user-context"

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )



}

export default MyApp
