import Head from 'next/head'
import Image from 'next/image'
import { useContext, useEffect } from 'react'
import { UserContext } from '../contexts/user-context'
import styles from '../styles/Home.module.css'

export default function Home() {

  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log("user", user);
  }, [])

  return (
    <h1>Wifi and Coffee</h1>
  )
}
