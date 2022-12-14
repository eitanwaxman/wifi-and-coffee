import { Avatar, Box, Stack, TextField, Button, FormControl, Select, InputLabel, MenuItem } from "@mui/material";
import { Widget } from "@uploadcare/react-widget";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/user-context";
import Link from "next/link";
import { WORK_STYLES } from "../utils/dropdown-options";

const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";

export default function Profile() {
    const { user, refreshAccessToken, refreshCurrentUser } = useContext(UserContext);

    const [updatedUser, setUpdatedUser] = useState()

    const [updateSuccessfull, setUpdateSuccessfull] = useState(false);

    const fileUploadHandler = async (event) => {
        console.log(event);
        setUpdatedUser((prev) => ({ ...prev, image: event.cdnUrl }))
    }

    const inputChangeHandler = (event) => {
        setUpdatedUser((prev) => ({ ...prev, [event.target.name]: event.target.value }))
        // console.log(event.target.)
    }

    const updateUser = async () => {
        refreshAccessToken();
        const TOKEN = user.credentials.access_token;

        const body = { ...updatedUser };
        console.log("body", body);
        const options = {
            "method": "PATCH",
            "headers": {
                "Content-Type": "application/json",
                Authorization: "Bearer " + TOKEN,
            },
            "body": JSON.stringify(body),
        }
        const response = await fetch(DIRECTUS_DOMAIN + '/users/me', options);
        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
            setUpdateSuccessfull(true);
            refreshCurrentUser();
        }
    }

    if (!user?.data) {
        return (
            <>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // height: '100vh',
                    padding: 3,
                }}>
                    <p>Please <span><Link href="/login">log in</Link></span> to view and edit your profile</p>
                </Box>
            </>
        )
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                // height: '100vh',
                padding: 3,
            }}>
                <Stack direction="column" spacing={2} alignItems="center">
                    <h1>Manage your profile</h1>
                    <Avatar sx={{ height: 100, width: 100 }} src={user?.data?.image || updatedUser?.image}></Avatar>
                    <p>
                        <label htmlFor='file'>Change profile picture:</label>{' '}
                        <Widget publicKey='3152c288f14a4c812f60' id='file' name='image' crop="1:1"
                            onChange={fileUploadHandler} />
                    </p>
                    <Stack spacing={2} direction="row">
                        <TextField id="firstName" name="first_name" label="First Name" variant="outlined" onChange={inputChangeHandler} value={updatedUser?.first_name || user?.data?.first_name || ""} />
                        <TextField id="lastName" name="last_name" label="Last Name" variant="outlined" onChange={inputChangeHandler} value={updatedUser?.last_name || user?.data?.last_name || ""} />
                    </Stack>
                    <FormControl fullWidth>
                        <InputLabel id="work-style-label">Work Style</InputLabel>
                        <Select
                            labelId="work-style-select-label"
                            id="work-style-select"
                            value={updatedUser?.work_style || user?.data?.work_style || ""}
                            label="Work Style"
                            name="work_style"
                            onChange={inputChangeHandler}
                        >
                            {WORK_STYLES.map((style) =>
                                <MenuItem key={style} value={style}>{style}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <Button variant="contained" onClick={updateUser}>Save Changes</Button>
                    {updateSuccessfull && <p>Profile updated successfully</p>}
                </Stack>
            </Box>
        </>
    )
}