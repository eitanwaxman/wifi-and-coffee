import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useState, useEffect } from 'react';


export default function Map({longitude, latitude}) {

    mapboxgl.accessToken = 'pk.eyJ1IjoiZWl0YW53YXhtYW4iLCJhIjoiY2xiOGNubHllMGsydTNvcnZnamlrZGNvaSJ9.UDzl1TBNjHHgDj5s45TydQ';

    const mapContainer = useRef(null);
    const map = useRef(null);
    //const marker = useRef(null);
    const [lng, setLng] = useState(longitude);
    const [lat, setLat] = useState(latitude);
    const [zoom, setZoom] = useState(14);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
        });


    });

    useEffect(() => {
        const marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map.current);
    }, [map])


    // const map = new mapboxgl.Map({
    //     container: 'map', // container ID
    //     // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    //     style: 'mapbox://styles/mapbox/streets-v12', // style URL
    //     center: [-74.5, 40], // starting position [lng, lat]
    //     zoom: 9 // starting zoom
    // });

    return (
        <>
            <div ref={mapContainer} className="map-container"></div>
            {/* <div ref={marker}></div> */}
        </>
    )
}