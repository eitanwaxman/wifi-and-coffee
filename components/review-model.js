import { useState, useContext, useEffect } from "react";
import { Stack, Rating, TextField, Button } from "@mui/material";
import { UserContext } from "../contexts/user-context";
import { v4 as uuidv4 } from 'uuid';

const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";

export default function ReviewModel({locationId}) {
    const { user, refreshAccessToken } = useContext(UserContext);

    const [review, setReview] = useState({
        _id: uuidv4(),
        text: "",
        coffee_rating: null,
        wifi_rating: null,
        location: locationId,
    })

    const changeHandler = (event, newValue) => {
        setReview((prev) => ({ ...prev, [event.target.name]: newValue || event.target.value }))
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
    }



    return (<>
        <Stack spacing={2} sx={{ width: '100%' }}>
            <h3>Add a first review about this location!</h3>
            <p>Rate the coffee ☕</p>
            <Rating
                name="coffee_rating"
                value={review.coffee_rating}
                onChange={changeHandler}
            />
            <p>Rate the wifi 🌐</p>
            <Rating
                name="wifi_rating"
                value={review.wifi_rating}
                onChange={changeHandler}
            />
            <p>Tell us about your remote working experiance!</p>
            <TextField
                id="text"
                name="text"
                label="Review"
                multiline
                rows={4}
                onChange={changeHandler}
            />
            <Button variant="contained" onClick={submitHandler}>Submit</Button>
        </Stack>
    </>)
}