import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import PinchIcon from '@mui/icons-material/Pinch';


export default function Map({ longitude, latitude }) {

    mapboxgl.accessToken = 'pk.eyJ1IjoiZWl0YW53YXhtYW4iLCJhIjoiY2xiOGNubHllMGsydTNvcnZnamlrZGNvaSJ9.UDzl1TBNjHHgDj5s45TydQ';

    const mapContainer = useRef(null);
    const map = useRef(null);
    //const marker = useRef(null);
    const [lng, setLng] = useState(longitude);
    const [lat, setLat] = useState(latitude);
    const [zoom, setZoom] = useState(14);
    const [dragZoom, setDragZoom] = useState(false);
    //const [dragPan, setDragPan] = useState(true);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom,
            //   dragPan: dragPan,
        });

        map.current.dragPan.disable();
        map.current.scrollZoom.disable();
        map.current.touchZoomRotate.disable();

    }, [mapContainer]);

    useEffect(() => {

        const marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map.current);
    }, [map])

    const toggleDragZoom = () => {
        if (!dragZoom) {
            map.current.dragPan.enable();
            map.current.scrollZoom.enable();
            map.current.touchZoomRotate.enable();
            setDragZoom(true);
        } else {
            map.current.dragPan.disable();
            map.current.scrollZoom.disable();
            map.current.touchZoomRotate.disable();
            setDragZoom(false);
        }
    }


    return (
        <>
            <Box sx={{ position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, zIndex: 1, background: "white" }}>
                    <IconButton onClick={toggleDragZoom} aria-label="zoom" >
                        <PinchIcon />
                    </IconButton>
                </div>
                <div ref={mapContainer} className="map-container"></div>
            </Box>
        </>
    )
}