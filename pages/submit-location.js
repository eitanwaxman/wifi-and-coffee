
import { Autocomplete, Box, Stack, TextField, Button, Paper } from "@mui/material";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/user-context";
import { Widget } from "@uploadcare/react-widget";
import Image from "next/image";
import { slugify } from "../utils/general";
import ReviewModel from "../components/review-model";
import { v4 as uuidv4 } from 'uuid';



const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";


export default function SubmitLocation() {

    const { user, refreshAccessToken } = useContext(UserContext);

    const [queryTimeout, setQueryTimeout] = useState();
    const [addressOptions, setAddressOptions] = useState([{ label: "Start typing to select an address", value: {} }])
    const [locationData, setLocationData] = useState({
        _id: uuidv4(),
        title: "",
        address: "",
        latitude: "",
        longitude: "",
        city: "",
        country: "",
        slug: "",
        cover_image: null,
    })

    const populateAddressOptions = (data) => {
        let options = [];
        data.features?.forEach((location) => {
            const option = { label: location.properties.formatted, value: location.properties };
            options.push(option);

            if (options.length === data.features.length) {
                setAddressOptions(options);
            }
        })
    }

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
        populateAddressOptions(data);
    }

    const changeHandler = (event) => {
        console.log(event.target.value);
        setLocationData((prev) => ({ ...prev, [event.target.name]: event.target.value }))
        if (event.target.name === "title") {
            setLocationData((prev) => ({ ...prev, slug: slugify(event.target.value) }))
        }
    }

    const inputHandler = (event) => {
        const input = event.target.value;
        clearTimeout(queryTimeout);
        setQueryTimeout(setTimeout(() => { queryAddress(input) }, 500));
    }

    const autocompleteHandler = (event, newValue) => {
        console.log(newValue.value);
        setLocationData((prev) => ({
            ...prev,
            address: newValue?.value.formatted,
            latitude: newValue?.value.lat,
            longitude: newValue?.value.lon,
            city: newValue?.value.city,
            country: newValue?.value.country,
        }))
    }

    const fileUploadHandler = async (event) => {
        console.log(event);
        setLocationData((prev) => ({ ...prev, cover_image: event.cdnUrl }))
    }

    const submitHandler = async () => {
        refreshAccessToken();
        const TOKEN = user.credentials.access_token;
        const body = { ...locationData };
        console.log(body);
        const options = {
            method: "POST",
            headers: {
                Authorization: "Bearer " + TOKEN,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        };
        const response = await fetch(DIRECTUS_DOMAIN + "/items/locations", options);
        console.log(response);
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

                <Stack spacing={2} sx={{ width: '50%', textAlign: "center" }}>
                    <h1>Submit a Location</h1>
                    <Paper elevation={3} sx={{
                        padding: 3,
                        textAlign: "left",
                    }}>
                        <Stack spacing={1}>
                            <h3>{locationData.title ? locationData.title : "Title"}</h3>
                            <p>{locationData.address ? locationData.address : "Address"}</p>
                            <Box sx={{
                                position: "relative",
                                height: "200px",
                                width: "100%",
                                borderRadius: "15px",
                                overflow: "hidden"
                            }}>
                                {locationData.cover_image && <Image src={locationData.cover_image} fill />}
                            </Box>
                        </Stack>
                    </Paper>
                    <Stack spacing={2} sx={{ width: '100%', textAlign: "center" }}>
                        <TextField id="title" name="title" label="Title" variant="outlined" required onChange={changeHandler} />
                        <Autocomplete
                            name="address"
                            options={addressOptions}
                            renderInput={(params) => <TextField {...params} label="Address" onInput={inputHandler} />}
                            onChange={autocompleteHandler}
                        />
                        <p>
                            <label htmlFor='file'>Please select a cover image:</label>{' '}
                            <Widget publicKey='3152c288f14a4c812f60' id='file' name='image' crop="3:2"
                                onChange={fileUploadHandler} />
                        </p>
                        <Button id="Submit and Continue" variant="contained" onClick={submitHandler}>Submit</Button>
                    </Stack>
                    <ReviewModel locationId={locationData.id} />
                </Stack>
            </Box>
        </>
    )
}