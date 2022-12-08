import { AppBar, Stack, Button } from "@mui/material";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useContext } from "react";
import { UserContext } from "../contexts/user-context";



export default function Navbar() {

    const { user, logout } = useContext(UserContext);

    return (
        <>
            <AppBar position="static">
                <Stack direction="row" spacing={5} sx={{ padding: 2, margin: "auto", alignItems: "center"}}>
                    <Link href="/">Home</Link>
                    <Link href="/locations">Browse</Link>
                    <Link href="/submit-location">Add</Link>
                    {user?.data ?
                        <Button onClick={logout} sx={{color: 'white', padding: "5px 0 0 0"}}>Log out</Button>
                        :
                        <Link href="/login">Login</Link>
                    }
                </Stack>
            </AppBar>
        </>
    )
}