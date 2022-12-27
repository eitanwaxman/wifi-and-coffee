import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { Box, Stack, Rating, Button, Modal, Paper, Alert, Avatar, Tooltip } from '@mui/material';
import Image from 'next/image'
import Map from '../../components/map';
import ReviewModel from '../../components/review-model';
import Link from 'next/link';
import MemberAvatar from '../../components/member-avatar';
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
import { LOCATION_TYPES } from '../../utils/dropdown-options';


const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";



export default function Location() {

    const router = useRouter()
    const { slug } = router.query;

    const [thisLocation, setThisLocation] = useState();
    const [reviews, setReviews] = useState([]);
    const [displayAllReviews, setDisplayAllReviews] = useState(false);
    const [ratings, setRatings] = useState({
        coffee: { total: null, average: null },
        wifi: { total: null, average: null },
        crowd: { total: null, average: null },
        noise: { total: null, average: null },
    })

    const [amenities, setAmenities] = useState({
        bathrooms: {
            exist: null,
            total: null,
        },
        outlets: {
            exist: null,
            total: null,
        },
        heating: {
            exist: null,
            total: null,
        },
        ac: {
            exist: null,
            total: null,
        },
        parking: {
            exist: null,
            total: null,
        },

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
        const coffeeRatingsCount = reviews.filter((review) => review.coffee_rating).length;
        const coffeeRatingAverage = coffeeRatingTotal / coffeeRatingsCount
        setRatings((prev) => ({ ...prev, coffee: { average: coffeeRatingAverage, total: wifiRatingsCount } }));

        const wifiRatingTotal = reviews.reduce((total, review) => total + review.wifi_rating, 0);
        const wifiRatingsCount = reviews.filter((review) => review.wifi_rating).length;
        const wifiRatingAverage = wifiRatingTotal / wifiRatingsCount;
        setRatings((prev) => ({ ...prev, wifi: { average: wifiRatingAverage, total: wifiRatingsCount } }));

        const crowdRatingTotal = reviews.reduce((total, review) => total + review.crowd_rating, 0);
        const crowdRatingCount = reviews.filter((review) => review.crowd_rating).length;
        const crowdRatingAverage = crowdRatingTotal / crowdRatingCount;
        setRatings((prev) => ({ ...prev, crowd: { average: crowdRatingAverage, total: crowdRatingCount } }));

        const noiseRatingTotal = reviews.reduce((total, review) => total + review.noise_rating, 0);
        const noiseRatingCount = reviews.filter((review) => review.noise_rating).length;
        const noiseRatingAverage = noiseRatingTotal / noiseRatingCount;
        setRatings((prev) => ({ ...prev, noise: { average: noiseRatingAverage, total: noiseRatingCount } }));

        Object.keys(amenities).forEach((amenity) => {
            const includesAmenity = reviews.filter((review) => review[amenity] === true);
            if (includesAmenity.length < 1) return;
            setAmenities((prev) => ({ ...prev, [amenity]: { exist: true, total: includesAmenity.length } }));
        })

    }, [reviews])

    useEffect(() => { console.log(amenities) }, [amenities])

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
                    <Stack sx={{ flexGrow: 1 }} justifyContent="space-between">
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
                        <Paper elevation={0} sx={{ width: "min-content", padding: 1, backgroundColor: "rgba(120,54,0, 0.3)" }}>
                            {thisLocation?.type && <p>{LOCATION_TYPES.find((type) => type.value === thisLocation?.type).label}</p>}
                        </Paper>
                        <br></br>
                        {reviews?.length > 0 ?
                            <>
                                <Stack direction="row" spacing={1}>
                                    {amenities.bathrooms?.exist &&
                                        <Tooltip title={'Bathrooms (based on ' + amenities.bathrooms?.total + ' review)'}>
                                            <WcIcon />
                                        </Tooltip>
                                    }
                                    {amenities.outlets?.exist &&
                                        <Tooltip title={'Outlets (based on ' + amenities.outlets?.total + ' review)'}>
                                            <OutletIcon />
                                        </Tooltip>
                                    }
                                    {amenities.heating?.exist &&
                                        <Tooltip title={'Heating (based on ' + amenities.heating?.total + ' review)'}>
                                            <FireplaceIcon />
                                        </Tooltip>
                                    }
                                    {amenities.ac?.exist &&
                                        <Tooltip title={'AC (based on ' + amenities.ac?.total + ' review)'}>
                                            <AcUnitIcon />
                                        </Tooltip>
                                    }
                                    {amenities.parking?.exist &&
                                        <Tooltip title={'Parking (based on ' + amenities.parking?.total + ' review)'}>
                                            <DirectionsCarIcon />
                                        </Tooltip>
                                    }
                                </Stack>
                                <br></br>
                                <p>Coffee ☕</p>
                                <Stack direction="row" spacing={2}>
                                    <Rating
                                        name="coffee_rating"
                                        precision={0.1}
                                        value={ratings.coffee.average}
                                        readOnly
                                    />
                                    <p>({ratings.coffee.average.toFixed(1)}) {ratings.coffee.total} ratings</p>
                                </Stack>
                                <p>Wifi 🌐</p>
                                <Stack direction="row" spacing={2}>
                                    <Rating
                                        name="wifi_rating"
                                        precision={0.1}
                                        value={ratings.wifi.average}
                                        readOnly
                                    />
                                    <p>({ratings.wifi.average.toFixed(1)}) {ratings.wifi.total} ratings</p>
                                </Stack>
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
                                        <br></br>
                                        {reviews.map((review, index) =>
                                            < Stack key={index} spacing={1}>
                                                <MemberAvatar memberId={review.user_created} size={20} name />
                                                <p>&quot;{review.text}&quot;</p>
                                                <br></br>
                                            </Stack>
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
                            maxHeight: 600,
                            overflowY: "scroll",
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                        }}>
                            <ReviewModel locationId={thisLocation?._id} onSuccess={handleCloseReviewModal} />
                        </Paper>
                    </Modal>
                    <Stack sx={{ flexGrow: 1 }}>
                        <Box sx={{
                            position: "relative",
                            // height: "200px",
                            minWidth: "300px",
                            maxHeight: "100%",
                            width: "100%",
                            aspectRatio: "3/2",
                            borderRadius: "15px",
                            overflow: "hidden",
                        }}>
                            {thisLocation?.cover_image && <Image src={thisLocation?.cover_image} alt={thisLocation?.title + thisLocation?.address + " cover image"} fill />}
                        </Box>
                        <br></br>
                        <Stack>
                            {reviews.filter((review) => review.image).slice(0, 3).map((review, index) => {
                                if (review.image) {
                                    return (
                                        <Box key={index} sx={{
                                            position: "relative",
                                            height: "100px",
                                            minWidth: "150px",
                                            width: "100px",
                                            borderRadius: "15px",
                                            overflow: "hidden",
                                        }}>
                                            <Image src={review?.image} alt={thisLocation?.title + thisLocation?.address + " -review-" + index} fill />
                                        </Box>
                                    )
                                }
                            }
                            )}
                        </Stack>
                    </Stack>
                </Box>
                {thisLocation?.longitude && thisLocation?.latitude &&
                    <Map longitude={thisLocation?.longitude} latitude={thisLocation?.latitude} />
                }
            </Box>
        </>
    )
}