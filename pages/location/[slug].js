import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import Image from 'next/image'
import dynamic from 'next/dynamic'


const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";



export default function Location() {

    const Map = dynamic(() => import('../../components/map'), {
        ssr: false,
    })
    
    const router = useRouter()
    const { slug } = router.query;

    const [thisLocation, setThisLocation] = useState();

    const getLocation = async (slug) => {
        const response = await fetch(DIRECTUS_DOMAIN + `/items/locations?filter[slug][_eq]=${slug}`);
        console.log(response)
        const { data } = await response.json();
        console.log(data);
        setThisLocation(data[0]);
    }

    useEffect(() => {
        getLocation(slug);
    }, [slug])

    return (
        <>
            <Box>
                <h1>{thisLocation?.title}</h1>
                <Box sx={{
                    position: "relative",
                    height: "200px",
                    width: "100%",
                    borderRadius: "15px",
                    overflow: "hidden"
                }}>
                    {thisLocation?.cover_image && <Image src={thisLocation?.cover_image} fill />}
                </Box>
                <Map/>
            </Box>
        </>
    )
}