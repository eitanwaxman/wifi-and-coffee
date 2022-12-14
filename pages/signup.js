import { Button, TextField, Stack, Box } from "@mui/material"
import { useContext, useState } from "react";
import SignupModel from "../components/signup-model";
import { UserContext } from "../contexts/user-context";
import { useRouter } from "next/router";
import Head from 'next/head'


export default function Signup() {

    const { user } = useContext(UserContext);
    const router = useRouter();

    if (user?.data) {
        router.push("/");
    }

    return (
        <>
            <Head>
                <title>Signup | Wifi and Coffee Club</title>
            </Head>

            <SignupModel />
        </>
    )
}