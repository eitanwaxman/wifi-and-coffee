import AcUnitIcon from '@mui/icons-material/AcUnit';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import OutletIcon from '@mui/icons-material/Outlet';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VolumeMuteOutlinedIcon from '@mui/icons-material/VolumeMuteOutlined';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import WcIcon from '@mui/icons-material/Wc';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Rating, Stack, TextField } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Widget } from "@uploadcare/react-widget";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from "../contexts/user-context";
import { speedTest } from "../utils/speed-test";


const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";

const WIFI_RATINGS = {
    0.5: '< 1 Mbps (Super slow)',
    1: '1-5 Mbps (Really slow)',
    1.5: '6-10 Mbps (Slow)',
    2: '11-20 Mbps (A bit slow)',
    2.5: '21-30 Mbps (Normal)',
    3: '30-50 Mbps (Above Average)',
    3.5: '51-70 Mbps (Fast)',
    4: '71-100 Mbps (Very Fast)',
    4.5: '101-200 Mbps (Really Fast)',
    5: '200+ Mbps (Super Fast)',
}

export default function ReviewModel({ locationId, onSuccess }) {
    const { user, refreshAccessToken } = useContext(UserContext);

    useEffect(() => { console.log(user) }, [user])

    const [review, setReview] = useState({
        _id: uuidv4(),
        text: "",
        coffee_rating: null,
        wifi_rating: null,
        location: locationId,
        image: null,
        bathrooms: null,
        outlets: null,
        heating: null,
        ac: null,
        parking: null,
        crowd_rating: null,
        noise_rating: null,
    })

    const [hoverRatings, setHoverRatings] = useState({
        coffee: -1,
        wifi: -1
    });

    const [expandedView, setExpandedView] = useState(false);

    const changeHandler = (event, newValue) => {
        setReview((prev) => ({ ...prev, [event.target.name]: newValue || event.target.value }))
    }

    const fileUploadHandler = async (event) => {
        console.log(event);
        setReview((prev) => ({ ...prev, image: event.cdnUrl }))
    }

    const runSpeedTest = async () => {
        const speed = await speedTest();
        console.log(speed);
    }

    const submitHandler = async () => {
        refreshAccessToken();
        const TOKEN = user.credentials.access_token;
        const body = { ...review };
        console.log(body);
        const options = {
            method: "POST",
            headers: {
                Authorization: "Bearer " + TOKEN,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        };
        const response = await fetch(DIRECTUS_DOMAIN + "/items/reviews", options);
        console.log(response);
        if (response.status === 204) {
            onSuccess();
        }
    }

    const StyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
            color: 'black',
        },
        '& .MuiRating-iconHover': {
            color: 'black',
        },
    });


    return (<>
        {!user?.data && <p>Please <span><Link href="/login">log in</Link></span> to leave a review</p>}
        <Stack spacing={2} sx={{ width: '100%' }}>
            <h3>Add a review about this location!</h3>
            <Stack direction="row" spacing={2}>
                <p>Rate the coffee ☕</p>
                <Rating
                    name="coffee_rating"
                    precision={0.5}
                    value={review.coffee_rating}
                    onChange={changeHandler}
                />
            </Stack>
            <Stack direction="row" spacing={2}>
                <p style={{ whiteSpace: "nowrap" }}>Rate the wifi 🌐</p>
                <Rating
                    name="wifi_rating"
                    precision={0.5}
                    value={review.wifi_rating}
                    onChange={changeHandler}
                    onChangeActive={(event, newHover) => {
                        setHoverRatings((prev) => ({ ...prev, wifi: newHover }))
                    }}
                />
            </Stack>
            <p style={{ fontSize: "0.8rem", margin: 0, padding: 0, }}>{WIFI_RATINGS[hoverRatings.wifi] || "Hover to view definition"}</p>
            <span><Link href="https://www.speedtest.net/" target="_blank" rel="noopener">Run a speed test</Link><p>(if at location)</p></span>
            <h5>Tell us about your remote working experiance!</h5>
            <TextField
                id="text"
                name="text"
                label="Review"
                multiline
                rows={4}
                onChange={changeHandler}
            />
            <p>
                <label htmlFor='file'>Add an image to your review:</label>{' '}
                <Widget publicKey='3152c288f14a4c812f60' id='file' name='image' crop="3:2"
                    onChange={fileUploadHandler} />
            </p>
            {review.image &&
                <Box sx={{
                    position: "relative",
                    height: "250px",
                    //minWidth: "300px",
                    width: "300",
                    borderRadius: "15px",
                    overflow: "hidden"
                }}>
                    <Image src={review.image} fill />
                </Box>}
            <Button onClick={() => setExpandedView((prev) => !prev)}>{expandedView ? "Show Less" : "Add More Info"}</Button>
            {expandedView &&
                <>
                    <Stack direction="column">
                        <p>Tell fellow members more about this location. Feel free to leave any criteria blank.</p>
                        <Stack direction="row" alignItems="center">
                            <FormGroup >
                                <FormControlLabel control={<Checkbox onChange={changeHandler} name="bathrooms"/>} label="Bathrooms" />
                            </FormGroup>
                            <WcIcon />
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <FormGroup >
                                <FormControlLabel control={<Checkbox onChange={changeHandler}  name="outlets" />} label="Outlets" />
                            </FormGroup>
                            <OutletIcon />
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <FormGroup >
                                <FormControlLabel control={<Checkbox onChange={changeHandler}  name="heating"/>} label="Heating (Winter)" />
                            </FormGroup>
                            <FireplaceIcon />
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <FormGroup >
                                <FormControlLabel control={<Checkbox onChange={changeHandler}  name="ac"/>} label="AC (Summer)" />
                            </FormGroup>
                            <AcUnitIcon />
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <FormGroup >
                                <FormControlLabel control={<Checkbox onChange={changeHandler}  name="parking"/>} label="Parking" />
                            </FormGroup>
                            <DirectionsCarIcon />
                        </Stack>
                        <br></br>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <p>How crowded was it?</p>
                            <StyledRating
                                name="crowd_rating"
                                precision={0.5}
                                value={review.crowd_rating}
                                onChange={changeHandler} 
                                icon={<PersonIcon fontSize="inherit" />}
                                emptyIcon={<PersonOutlineIcon fontSize="inherit" />}
                            />
                        </Stack>
                        <br></br>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <p>How noisy was it?</p>
                            <StyledRating
                                name="noise_rating"
                                precision={0.5}
                                value={review.noise_rating}
                                onChange={changeHandler} 
                                icon={<VolumeUpIcon fontSize="inherit" />}
                                emptyIcon={<VolumeUpOutlinedIcon fontSize="inherit" />}
                            />
                        </Stack>
                    </Stack>

                </>
            }
            {/* add more rating options */}
            {/* add image upload option here > slideshow of images on location page */}
            <Button variant="contained" onClick={submitHandler} disabled={user.data === null}>Submit</Button>
        </Stack>
    </>)
}