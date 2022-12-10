import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { Box, Stack, Rating, Button, Modal, Paper, Alert } from '@mui/material';
import Image from 'next/image'
import Map from '../../components/map';
import ReviewModel from '../../components/review-model';
import Link from 'next/link';


const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";



export default function Location() {

    const router = useRouter()
    const { slug } = router.query;

    const [thisLocation, setThisLocation] = useState();
    const [reviews, setReviews] = useState([]);
    const [displayAllReviews, setDisplayAllReviews] = useState(false);
    const [ratings, setRatings] = useState({
        coffee: null,
        wifi: null,
    })

    const [reviewModal, setReviewModal] = useState(false);
    const handleOpenReviewModal = () => setReviewModal(true);
    const handleCloseReviewModal = () => setReviewModal(false);


    const getLocation = async (slug) => {
        const response = await fetch(DIRECTUS_DOMAIN + `/items/locations?filter[slug][_eq]=${slug}`);
        const { data } = await response.json();
        console.log("getLocation", data);
        setThisLocation(data[0]);
    }

    const getReviews = async () => {
        const response = await fetch(DIRECTUS_DOMAIN + `/items/reviews?filter[location][_eq]=${thisLocation?._id}`);
        const { data } = await response.json();
        console.log("getReviews", data);

        if (data.length < 1) return;
        setReviews(data);
    }

    useEffect(() => {
        if (!slug) return;
        getLocation(slug);
    }, [slug])

    useEffect(() => {
        if (location.length < 1) return;
        getReviews();
    }, [thisLocation])

    useEffect(() => {
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
                        {thisLocation?.status === "draft" &&
                            <Alert severity="info">This location is pending review by our moderators - you can still view it and submit reviews.</Alert>
                        }
                        <h1>{thisLocation?.title}</h1>
                        <span>
                            <a target="_blank" rel="noreferrer" href={`http://maps.google.com/?q=${thisLocation?.address}`}>
                                {thisLocation?.address}
                            </a>
                        </span>
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
                                {!displayAllReviews ?

                                    reviews.slice(0, 2).map((review, index) =>
                                        < div key={index}>
                                            <p >&quot;{review.text}&quot;</p>
                                            <br></br>
                                        </div>
                                    )
                                    :
                                    <>
                                        <h3>All Reviews</h3>
                                        {reviews.map((review, index) =>
                                            < div key={index}>
                                                <p >&quot;{review.text}&quot;</p>
                                                <br></br>
                                            </div>
                                        )}
                                    </>
                                }
                            </>
                            :
                            <p>No reviews yet</p>
                        }
                        <Button onClick={() => { setDisplayAllReviews((prev) => !prev) }}>{!displayAllReviews ? "View All" : "Show Less"}</Button>
                        <Button variant="contained" onClick={handleOpenReviewModal}>Add a Review</Button>
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
                            <ReviewModel locationId={thisLocation?._id} onSuccess={handleCloseReviewModal} />
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
                        {thisLocation?.cover_image && <Image src={thisLocation?.cover_image} alt={thisLocation?.title + thisLocation?.address + " cover image"} fill />}
                    </Box>
                </Box>
                {thisLocation?.longitude && thisLocation?.latitude &&
                    <Map longitude={thisLocation?.longitude} latitude={thisLocation?.latitude} />
                }
            </Box>
        </>
    )
}