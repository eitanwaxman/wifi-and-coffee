import { Button, TextField, Stack, Box, Checkbox, FormControlLabel } from "@mui/material"
import { useState, useContext } from "react";
import { UserContext } from "../contexts/user-context";
import Link from "next/link";

const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";

export default function Login() {
    const { updateUserCredentials, updateUserCookieOption, user } = useContext(UserContext);

    const [userCredentials, setUserCredentials] = useState({
        email: "",
        password: "",
    });

    const [storeCookie, setStoreCookie] = useState(false);

    const inputChangeHandler = (event) => {
        setUserCredentials({ ...userCredentials, [event.target.name]: event.target.value })
    }

    const checkboxHandler = (event) => {
        setStoreCookie(event.target.checked);
    }

    const loginUser = async () => {
        const body = { ...userCredentials };
        console.log("body", body);
        const options = {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(body),
        }
        const response = await fetch(DIRECTUS_DOMAIN + "/auth/login", options);
        const {data} = await response.json();
        console.log(data);
        if (data) {
            updateUserCredentials(data);
            updateUserCookieOption(storeCookie);
        }
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: "center",
            }}>
                <Stack spacing={2}>
                    <h1>Log in</h1>
                    <p>Don't have an account yet? Click <span><Link href="/signup">here</Link></span> to sign up</p>
                    <TextField id="email" name="email" label="Email" variant="outlined" required onChange={inputChangeHandler} />
                    <TextField id="password" name="password" label="Password" type="password" variant="outlined" required onChange={inputChangeHandler} />
                    <FormControlLabel control={ <Checkbox onChange={checkboxHandler} />} label="Store my info in a 🍪 for safe keeping"/>
                    <Button id="submit" variant="contained" onClick={loginUser}>Submit</Button>
                </Stack>
            </Box>
        </>
    )
}