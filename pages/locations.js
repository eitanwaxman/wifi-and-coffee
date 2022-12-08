import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Box, Stack, Paper, Button } from "@mui/material";
import Image from "next/image";


const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";

export default function Locations() {

    const router = useRouter();

    const [locations, setLocations] = useState([]);

    const getLocations = async () => {
        const response = await fetch(DIRECTUS_DOMAIN + "/items/locations");
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
            <Box sx={{
                padding: 3,
                textAlign: "center"
            }}>
                <Stack spacing={1} sx={{ textAlign: "center", margin: 3, fontSize: "1.7rem" }}>
                    <h1>Browse Locations</h1>
                    <p>Find the ideal place to sink in for some work, a study session, or just a nice cup of joe...</p>
                </Stack>
                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 2,
                }}>
                    {locations && locations.map((location, index) =>
                        <>
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
                                        {location.cover_image && <Image src={location.cover_image} fill />}
                                    </Box>
                                </Stack>
                            </Paper>
                        </>
                    )}
                </Box>
                <br></br>
                <Button onClick={()=> router.push("/submit-location")}>Add a Location</Button>
            </Box>
        </>
    )
}