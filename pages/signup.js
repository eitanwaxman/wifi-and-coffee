import { Button, TextField, Stack, Box } from "@mui/material"
import { useState } from "react";

export default function Signup() {
    const [userCredentials, setUserCredentials] = useState({
        email: "",
        password: "",
    });

    const inputChangeHandler = (event) => {
        setUserCredentials({ ...userCredentials, [event.target.name]: event.target.value })
    }

    const registerUser = async () => {
        const body = { ...userCredentials };
        console.log("body", body);
        const options = {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(body),
        }
        const response = await fetch("/api/signup", options);
        const data = await response.json();
        console.log(data);
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
                <Stack spacing={2}>
                    <h1>Sign Up</h1>
                    <TextField id="email" name="email" label="Email" variant="outlined" required onChange={inputChangeHandler} />
                    <TextField id="password" name="password" label="Password" type="password" variant="outlined" required onChange={inputChangeHandler} />
                    <Button id="submit" variant="contained" onClick={registerUser}>Submit</Button>
                </Stack>
            </Box>
        </>
    )
}