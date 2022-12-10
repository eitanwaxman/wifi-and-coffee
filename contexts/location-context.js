import { createContext, useEffect, useState } from "react";

const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";

const defaultLocation = {
    longitude: null,
    latitude: null
}


export const LocationContext = createContext(defaultLocation);

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(defaultLocation);

    useEffect(() => {
        const { longitude, latitude } = location;
        if (longitude && latitude) return;
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        });
    }, [])

    const value = { location }

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    )
}
