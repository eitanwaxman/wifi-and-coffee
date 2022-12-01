import { Button, TextField, Stack, Box } from "@mui/material"
import { useState } from "react";
import Link from "next/link";

export default function SignupModel() {
    const [userCredentials, setUserCredentials] = useState({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
    });

    const [formValid, setFormValid] = useState({
        emailValid: true,
        fNameValid: true,
        lNameValid: true,
        passwordValid: true,
    })



    const [signupComplete, setSignupComplete] = useState(false);

    const inputChangeHandler = (event) => {
        setUserCredentials({ ...userCredentials, [event.target.name]: event.target.value })
    }

    const runValidation = () => {
        const { email, first_name, last_name, password } = userCredentials;
        const emailValid = email.includes("@")
        const fNameValid = first_name.length > 2;
        const lNameValid = last_name.length > 2;
        const passwordValid = password.length > 8;

        setFormValid({ emailValid, fNameValid, lNameValid, passwordValid });

        return emailValid && fNameValid && lNameValid && passwordValid;
    }

    const sendEmail = async () => {
        const { email, first_name, last_name } = userCredentials;
        const body = {
            email,
            first_name,
            last_name,
            subject: "Thanks for joining the Wifi and Coffee Club!",
            text: "Thats all..."
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }

        const response = await fetch("/api/email", options);
        console.log(response);
    }


    const registerUser = async () => {
        const valid = runValidation();
        if (!valid) return;

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
        if (response.status === 200) {
            setSignupComplete(true);
            sendEmail();
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
                padding: 3,
            }}>
                {!signupComplete ?
                    <Stack spacing={2} textAlign="center">
                        <h1>Join the Waitlist</h1>
                        <p>Already have an account yet? Click <span><Link href="/login">here</Link></span> to log in</p>
                        <Stack spacing={2} direction="row">
                            <TextField id="firstName" name="first_name" label="First Name" variant="outlined" required onChange={inputChangeHandler} error={!formValid.fNameValid} />
                            <TextField id="lastName" name="last_name" label="Last Name" variant="outlined" required onChange={inputChangeHandler} error={!formValid.lNameValid} />
                        </Stack>
                        <TextField id="email" name="email" label="Email" variant="outlined" required onChange={inputChangeHandler} error={!formValid.emailValid} />
                        <TextField id="password" name="password" label="Password" type="password" variant="outlined" required onChange={inputChangeHandler} error={!formValid.passwordValid} />
                        <Button id="submit" variant="contained" onClick={registerUser}>Submit</Button>
                        {(!formValid.emailValid || !formValid.fNameValid || !formValid.lNameValid || !formValid.passwordValid) &&
                            <p>Uh oh seems you missed something 😅</p>
                        }
                    </Stack>
                    :
                    <Stack spacing={2} textAlign="center">
                        <p>Thanks for joining the waitlist! </p>
                        <p>You now have observer status and can <span><Link href="/locations">browse our locations</Link></span></p>
                    </Stack>
                }
            </Box>
        </>
    )
}