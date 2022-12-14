import { AppBar, Stack, Button, Avatar, Drawer, IconButton } from "@mui/material";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/user-context";
import MenuIcon from '@mui/icons-material/Menu';



export default function Navbar() {

    const { user, logout } = useContext(UserContext);
    const router = useRouter();

    const [mobile, setMobile] = useState();
    const [mobileMenu, setMobileMenu] = useState(false);

    useEffect(() => {
        setMobile(window.innerWidth < 600);
        window.addEventListener('resize', () => {
            setMobile(window.innerWidth < 600)
        })
    }, [])

    useEffect(() => { console.log(user) }, [user])

    const toggleMobileMenu = () => {
        setMobileMenu((prev) => !prev)
    }

    return (
        <>
            <AppBar position="static" sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 2% 0",
            }}>
                {!mobile ?
                    <Stack direction="row" spacing={5} sx={{ padding: 2, margin: "auto", alignItems: "center" }}>
                        <Link href="/">Home</Link>
                        <Link href="/locations">Browse</Link>
                        <Link href="/submit-location">Add</Link>
                        {user?.data ?
                            <Button onClick={logout} sx={{ color: 'white', padding: "5px 0 0 0" }}>Log out</Button>
                            :
                            <Link href="/login">Login</Link>
                        }
                    </Stack>
                    :
                    <IconButton onClick={toggleMobileMenu}>
                        <MenuIcon sx={{ color: "white", marginRight: "auto" }} />
                    </IconButton>
                }
                <Avatar sx={{ cursor: "pointer", margin: 2, outline: "solid white 2px" }} onClick={() => router.push("/profile")} src={user?.data?.image} alt={user?.data?.first_name + " " + user?.data?.last_name}></Avatar>
            </AppBar>
            <Drawer
                anchor="right"
                open={mobileMenu}
                onClose={toggleMobileMenu}
            >
                <Stack onClick={toggleMobileMenu} direction="column" spacing={4} sx={{ padding: 2, margin: 5, alignItems: "center" }}>
                    <span><Link href="/">Home</Link></span>
                    <span><Link href="/locations">Browse</Link></span>
                    <span> <Link href="/submit-location">Add</Link></span>
                    {user?.data ?
                        <Button onClick={logout} sx={{ color: 'brown', padding: "5px 0 0 0" }}>Log out</Button>
                        :
                        <span><Link href="/login">Login</Link></span>
                    }
                </Stack>
            </Drawer>
        </>
    )
}