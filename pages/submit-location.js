
import { Autocomplete, Box, Stack, TextField, Button, getBottomNavigationActionUtilityClass } from "@mui/material";
import { useState } from "react";

export default function SubmitLocation() {

    const [queryTimeout, setQueryTimeout] = useState();
    const [addressOptions, setAddressOptions] = useState([{ label: "Start typing to select an address", value: getBottomNavigationActionUtilityClass }])

    const queryAddress = async (addressQuery) => {
        const response = await fetch("/api/address", {
            method: "POST",
            body: JSON.stringify(addressQuery),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log(data);
    }

    const changeHandler = (event) => {
        console.log(event.target.value);
    }

    const inputHandler = (event) => {
        const input = event.target.value;
        clearTimeout(queryTimeout);
        setQueryTimeout(setTimeout(() => { queryAddress(input) }, 500));
    }

    const submitHandler = () => {

    }
    return (
        <>
            <h1>Submit a Location</h1>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
                <Stack spacing={2}>
                    <TextField id="title" name="title" label="Title" variant="outlined" required onChange={changeHandler} />
                    <Autocomplete
                        options={addressOptions}
                        renderInput={(params) => <TextField {...params} label="Address" />}
                        onInput={inputHandler}
                    />
                    <Button id="submit" variant="contained" onClick={submitHandler}>Submit</Button>
                </Stack>
            </Box>
        </>
    )
}