import Head from 'next/head'
import Image from 'next/image'
import { useContext, useEffect } from 'react'
import { UserContext } from '../contexts/user-context'
import { Box, Typography, Stack, Button, Container } from '@mui/material'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'



export default function Home() {

  const router = useRouter();
  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log("user", user);
  }, [])

  const waitlistHandler = () => {
    router.push("/signup");
  }

  return (
    <>
      <Head>
        <title>Wifi and Coffee Club - Find the Perfect Remote Work Location</title>
        <meta name="description" content="Find the perfect remote work location at Wifi and Coffee Club. Our listings include cafes, co-working spaces, and more. Leave reviews and find the best places to get work done and enjoy a cup of coffee." />
        <meta name="keywords" content="Wifi and Coffee Club, remote work, cafes, co-working spaces, work location, reviews" />
        <meta name="author" content="Wifi and Coffee Club" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />

        {/* <!-- Search Engine --> */}
        <meta name="google-site-verification" content="verification_code" />
        <link rel="canonical" href="https://www.wifiandcoffee.club/" />

        {/* <!-- Social Media --> */}
        <meta property="og:title" content="Wifi and Coffee Club - Find the Perfect Remote Work Location" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.wifiandcoffee.club/" />
        <meta property="og:image" content="https://www.wifiandcoffee.club/coffee-shop.jpg" />
        <meta property="og:description" content="Find the perfect remote work location at Wifi and Coffee Club. Our listings include cafes, co-working spaces, and more. Leave reviews and find the best places to get work done and enjoy a cup of coffee." />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Wifi and Coffee Club - Find the Perfect Remote Work Location" />
        <meta name="twitter:description" content="Find the perfect remote work location at Wifi and Coffee Club. Our listings include cafes, co-working spaces, and more. Leave reviews and find the best places to get work done and enjoy a cup of coffee." />
        <meta name="twitter:image" content="https://www.wifiandcoffee.club/coffee-shop.jpg" />
      </Head>


      <div className={styles["hero-image"]}>
        <Image style={{ objectFit: "cover" }} src="/coffee-shop.jpg" fill />
        <div style={{ position: "relative", width: "100%", height: "100%", background: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))", zIndex: 1 }}></div>
      </div>
      <Box sx={{
        position: "absolute",
        top: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        padding: "10%",
        paddingTop: "15%",
        // height: "max-content",
      }}>
        <Container sx={{ padding: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, color: "white", fontSize: "1.7rem", textShadow: "2px 2px 2px black", maxWidth: "500px" }}>
            <h1 className={styles["home-title"]}>A Home for Remote Workers</h1>
            <p className={styles["home-text"]}>Discover, share, and review the best remote work and study locations in NYC</p>
            <Button variant="contained" onClick={waitlistHandler}>Join The Club</Button>
          </Box>
        </Container>
      </Box>
    </>
  )
}
