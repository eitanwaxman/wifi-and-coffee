
import { Autocomplete, Box, Stack, TextField, Button, Paper } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/user-context";
import { Widget } from "@uploadcare/react-widget";
import Image from "next/image";
import { slugify } from "../utils/general";
import ReviewModel from "../components/review-model";
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link'
import { useRouter } from "next/router";
import Map from "../components/map"
import { LocationContext } from "../contexts/location-context";
import LocationOnIcon from '@mui/icons-material/LocationOn';




const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";


export default function SubmitLocation() {

    const router = useRouter();

    const { user, refreshAccessToken } = useContext(UserContext);
    const { location } = useContext(LocationContext);

    useEffect(() => {
        console.log(location);
    }, [location])

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

    const [locationSubmitted, setLocationSubmitted] = useState(false);

    useEffect(() => {
        console.log(user);
    }, [user])

    const populateAddressOptions = (data) => {
        console.log("populating options")
        let options = [];
        data.features?.forEach((location) => {
            const option = { label: location.properties.formatted, value: location.properties };
            options.push(option);
            console.log(options.length, data.features.length)
            if (options.length === data.features.length) {
                setAddressOptions([...options]);
            }
        })
    }

    const queryAddress = async (text) => {
        console.log("querying address")
        const { longitude, latitude } = location;
        const addressQuery = {
            text,
            longitude,
            latitude
        }
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
            setLocationData((prev) => ({ ...prev, slug: slugify(event.target.value) + `-${locationData._id}` }))
        }
    }

    const inputHandler = (event) => {
        console.log("input recived")
        const input = event.target.value.trim();
        clearTimeout(queryTimeout);
        setQueryTimeout(setTimeout(() => { queryAddress(input) }, 500));
    }

    const autocompleteHandler = (event, newValue) => {
        console.log("autocomplete handler called")
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
        if (response.status === 204) {
            setLocationSubmitted(true);
        } else {
            const data = await response.json();
            console.log(data);
        }

    }

    const navigateToLocation = () => {
        router.push(`/location/${locationData.slug}`);
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
                    <p>Please <span><Link href="/login">log in</Link></span> to submit a location</p>
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
                <h1>Submit a Location</h1>
                <br></br>
                <Stack spacing={2} sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    flexWrap: "wrap",
                    width: '90%',
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center"
                }}>

                    {!locationSubmitted ?
                        <Stack spacing={2} sx={{ width: '100%', maxWidth: "500px", textAlign: "center" }}>
                            <TextField id="title" name="title" label="Title" variant="outlined" required onChange={changeHandler} />
                            <Autocomplete
                                name="address"
                                options={addressOptions}
                                renderInput={(params) => <TextField {...params} label="Address" onInput={inputHandler} />}
                                onChange={autocompleteHandler}
                                loading={addressOptions.length === 0}
                                filterOptions={(x) => x}
                            />
                            <p>
                                <label htmlFor='file'>Please select a cover image:</label>{' '}
                                <Widget publicKey='3152c288f14a4c812f60' id='file' name='image' crop="3:2"
                                    onChange={fileUploadHandler} />
                            </p>
                            <Button id="Submit and Continue" variant="contained" onClick={submitHandler}>Submit</Button>
                        </Stack> :
                        <Box>
                            <ReviewModel locationId={locationData._id} onSuccess={navigateToLocation} />
                        </Box>
                    }

                    <Paper elevation={3} sx={{
                        padding: 3,
                        textAlign: "left",
                        width: "400px",
                    }}>
                        <Stack spacing={1}>
                            <h3>{locationData.title ? locationData.title : "Title"}</h3>
                            <p>{locationData.address ? locationData.address : "Address"}</p>
                            <Box sx={{
                                position: "relative",
                                height: "250px",
                                //minWidth: "300px",
                                width: "300",
                                borderRadius: "15px",
                                overflow: "hidden"
                            }}>
                                {locationData.cover_image && <Image src={locationData.cover_image} fill />}
                                {locationData.longitude && locationData.latitude && <Map longitude={locationData.longitude} latitude={locationData.latitude} />}
                            </Box>
                        </Stack>
                    </Paper>
                </Stack>


            </Box>
        </>
    )
}