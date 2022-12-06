import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { Box, Stack, Rating, Button, Modal, Paper } from '@mui/material';
import Image from 'next/image'
import Map from '../../components/map';
import ReviewModel from '../../components/review-model';


const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";



export default function Location() {

    const router = useRouter()
    const { slug } = router.query;

    const [thisLocation, setThisLocation] = useState();
    const [reviews, setReviews] = useState([]);
    const [ratings, setRatings] = useState({
        coffee: null,
        wifi: null,
    })

    const [reviewModal, setReviewModal] = useState(false);
    const handleOpenReviewModal = () => setReviewModal(true);
    const handleCloseReviewModal = () => setReviewModal(false);


    const getLocation = async (slug) => {
        const response = await fetch(DIRECTUS_DOMAIN + `/items/locations?filter[slug][_eq]=${slug}`);
        console.log(response)
        const { data } = await response.json();
        console.log(data);
        setThisLocation(data[0]);
    }

    const getReviews = async () => {
        const response = await fetch(DIRECTUS_DOMAIN + `/items/reviews?filter[location][_eq]=${thisLocation?._id}`);
        console.log(response)
        const { data } = await response.json();
        console.log(data);

        if (data.length < 1) return;
        setReviews(data);
    }

    useEffect(() => {
        getLocation(slug);
    }, [slug])

    useEffect(() => {
        console.log(thisLocation);
        getReviews();
    }, [thisLocation])

    useEffect(() => {
        console.log(reviews);
        const coffeeRatingTotal = reviews.reduce((total, review) => total + review.coffee_rating, 0);
        const coffeeRatingAverage = coffeeRatingTotal / reviews.length;
        setRatings((prev) => ({ ...prev, coffee: coffeeRatingAverage }));

        const wifiRatingTotal = reviews.reduce((total, review) => total + review.wifi_rating, 0);
        const wifiRatingAverage = wifiRatingTotal / reviews.length;
        setRatings((prev) => ({ ...prev, wifi: wifiRatingAverage }));

    }, [reviews])

    return (
        <>
            <Box>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: 2,
                    padding: 3
                }}>
                    <Stack>
                        <h1>{thisLocation?.title}</h1>
                        <p>{thisLocation?.address}</p>
                        <br></br>
                        {reviews?.length > 0 ?
                            <>
                                <p>Coffee ☕</p>
                                <Rating
                                    name="coffee_rating"
                                    value={ratings.coffee}
                                    readOnly
                                />
                                <p>Wifi 🌐</p>
                                <Rating
                                    name="wifi_rating"
                                    value={ratings.wifi}
                                    readOnly
                                />
                                <br></br>
                                {reviews.map((review) => <p>"{review.text}"</p>)}
                            </>
                            :
                            <p>No reviews yet</p>
                        }
                        <Button onClick={handleOpenReviewModal}>Add a Review</Button>
                    </Stack>
                    <Modal
                        open={reviewModal}
                        onClose={handleCloseReviewModal}
                        aria-labelledby="review-modal"
                        aria-describedby="add-a-review"
                    >
                        <Paper sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                        }}>
                            <ReviewModel locationId={thisLocation?._id} />
                        </Paper>
                    </Modal>
                    <Box sx={{
                        position: "relative",
                        height: "200px",
                        maxWidth: "300px",
                        width: "100%",
                        borderRadius: "15px",
                        overflow: "hidden",
                    }}>
                        {thisLocation?.cover_image && <Image src={thisLocation?.cover_image} fill />}
                    </Box>
                </Box>
                {thisLocation?.longitude && thisLocation?.latitude &&
                    <Map longitude={thisLocation?.longitude} latitude={thisLocation?.latitude} />
                }
            </Box>
        </>
    )
}