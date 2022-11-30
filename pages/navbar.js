import { AppBar, Stack, Button } from "@mui/material";
import { useRouter } from 'next/router'
import Link from 'next/link'



export default function Navbar() {

    return (
        <>
            <AppBar position="static">
                <Stack direction="row" spacing={2} sx={{padding: 2, margin: "auto"}}>
                <Link href="/">Home</Link>
                <Link href="/locations">Browse</Link>
                <Link href="/submit-location">Add</Link>
                <Link href="/login">Login</Link>
                </Stack>
            </AppBar>
        </>
    )
}