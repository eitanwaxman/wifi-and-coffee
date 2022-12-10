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
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // height: "max-content",
      }}>
        <Container sx={{ padding: 3 }}>
          <Stack sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ width: "100%", maxWidth: "500px" }}>
              <img src="/logo.svg" />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, fontSize: "1.7rem", maxWidth: "500px" }}>
              <h1>A Home for Remote Workers</h1>
              <p>Discover, share, and review the best remote work and study locations in NYC</p>
              <Button variant="contained" onClick={waitlistHandler}>Join The Waitlist</Button>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  )
}
