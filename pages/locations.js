import { useRouter } from "next/router";
import { useState, useEffect, useContext, useRef } from "react";
import { Box, Stack, Paper, Button, TextField, IconButton, InputAdornment } from "@mui/material";
import Image from "next/image";
import { LocationContext } from "../contexts/location-context";
import ClearIcon from '@mui/icons-material/Clear';
import Head from 'next/head'


const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";

export default function Locations() {

    const router = useRouter();

    const { location } = useContext(LocationContext);
    const [locations, setLocations] = useState([]);
    const [query, setQuery] = useState("");

    const getLocations = async () => {
        setQuery("");
        const response = await fetch(DIRECTUS_DOMAIN + "/items/locations");
        const { data } = await response.json();
        console.log(data);
        setLocations(data);
    }

    const calcDistance = (locationItem) => {
        const userLat = location.latitude;
        const userLon = location.longitude;
        const locationLat = locationItem.latitude;
        const locationLon = locationItem.longitude;
        const distance = Math.sqrt(Math.pow(userLat - locationLat, 2) + Math.pow(userLon - locationLon, 2));
        return distance;
    }

    const getLocationsNearMe = async () => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(location)
        }
        const response = await fetch("/api/near-me", options);
        const { data } = await response.json();
        data.sort((a, b) => calcDistance(a) - calcDistance(b))
        setLocations(data);
        console.log(data);
    }

    const changeHandler = (event) => {
        const input = event.target.value;
        setQuery(input);
    }

    const search = async () => {
        const response = await fetch(DIRECTUS_DOMAIN + `/items/locations?filter[address][_contains]=${query}`);
        const { data } = await response.json();
        console.log(data);
        setLocations(data);
    }

    useEffect(() => {
        getLocations();
    }, [])

    const navigateToLocationHandler = (slug) => {
        console.log(slug)
        router.push(`/location/${slug}`)
    }

    return (
        <>

            <Head>
                <title>Locations - Wifi and Coffee Club</title>
                <meta name="description" content="Browse and search for the perfect remote work location at Wifi and Coffee Club. Our listings include cafes, co-working spaces, and more. Leave reviews and find the best places to get work done and enjoy a cup of coffee." />
                <meta name="keywords" content="Locations, Wifi and Coffee Club, remote work, cafes, co-working spaces, work location, reviews" />
                <meta name="author" content="Wifi and Coffee Club" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="robots" content="index, follow" />

                {/* <!-- Search Engine --> */}
                <meta name="google-site-verification" content="verification_code" />
                <link rel="canonical" href="https://www.wifiandcoffee.club/locations" />

                {/* <!-- Social Media --> */}
                <meta property="og:title" content="Locations - Wifi and Coffee Club" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.wifiandcoffee.club/locations" />
                <meta property="og:image" content="https://www.wifiandcoffee.club/coffee-shop.jpg" />
                <meta property="og:description" content="Browse and search for the perfect remote work location at Wifi and Coffee Club. Our listings include cafes, co-working spaces, and more. Leave reviews and find the best places to get work done and enjoy a cup of coffee." />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Locations - Wifi and Coffee Club" />
                <meta name="twitter:description" content="Browse and search for the perfect remote work location at Wifi and Coffee Club. Our listings include cafes, co-working spaces, and more. Leave reviews and find the best places to get work done and enjoy a cup of coffee." />
                <meta name="twitter:image" content="https://www.wifiandcoffee.club/coffee-shop.jpg" />
            </Head>

            <Box sx={{
                padding: 3,
                textAlign: "center"
            }}>
                <Stack spacing={1} sx={{ maxWidth: "1200px", textAlign: "center", margin: "auto", fontSize: "1.5rem" }}>
                    <h1>Browse Locations</h1>
                    <p style={{ fontSize: "1.2rem" }}>Find the ideal place to sink in for some work, a study session, or just a nice cup of joe...</p>
                    <TextField
                        onChange={changeHandler}
                        sx={{ outline: "2px solid #783600", borderRadius: "5px" }}
                        placeholder="Search by name or address"
                        value={query}
                        InputProps={{
                            endAdornment:
                                <InputAdornment>
                                    <IconButton
                                        aria-label="clear search"
                                        onClick={getLocations}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                        }}
                    >
                    </TextField>
                    <Stack direction="row" justifyContent="center" alignItems="center" flexWrap="wrap">
                        <Button onClick={search} variant="contained">Search</Button>
                        <Button onClick={getLocationsNearMe}>or find places near me</Button>
                    </Stack>
                    <br></br>
                </Stack>
                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 2,
                }}>
                    {locations && locations.map((location, index) =>
                        <Paper key={index} elevation={3} sx={{
                            height: "230px",
                            width: "280px",
                            padding: 2,
                            textAlign: "left",
                            borderRadius: "15px",
                            cursor: "pointer",
                            "&:hover": {
                                outline: "solid #783600 2px"
                            }
                        }}
                            onClick={() => { navigateToLocationHandler(location.slug) }}
                        >
                            <Stack sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}>
                                <h3>{location.title ? location.title : "Title"}</h3>
                                <p>{location.address ? location.address : "Address"}</p>
                                <Box sx={{
                                    position: "relative",
                                    height: "120px",
                                    width: "100%",
                                    borderRadius: "15px",
                                    overflow: "hidden"
                                }}>
                                    {location.cover_image && <Image src={location.cover_image} alt={location?.title + location?.address + " cover image"} fill />}
                                </Box>
                            </Stack>
                        </Paper>
                    )}
                </Box>
                <br></br>
                <Button onClick={() => router.push("/submit-location")}>Add a Location</Button>
            </Box>
        </>
    )
}