import { createContext, useEffect, useState } from "react";

const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";

const defaultUser = {
    storeCookie: false,
    credentials: null,
    data: null
}


export const UserContext = createContext(defaultUser);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(defaultUser);

    useEffect(() => {
        let cookie = sessionStorage.getItem("user");
        let decodedCookie = JSON.parse(cookie);
        setUser(decodedCookie);
    }, [])

    useEffect(() => {
        if (user?.storeCookie) {
            console.log("storing cookie", user)
            sessionStorage.setItem("user", JSON.stringify(user));
        }
    }, [user])

    const updateUserCookieOption = async (storeCookie) => {
        setUser((prev) => ({ ...prev, storeCookie }))
    }

    const getCurrentUser = async (token) =>{
        const options = {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
        }
        const response = await fetch(DIRECTUS_DOMAIN + "/users/me", options);
        const {data} = await response.json();
        console.log("currentUser", data);
        return data;
    }

    const updateUserCredentials = async (credentials) => {
        console.log("context", credentials);
        setUser((prev) => ({ ...prev, credentials }))
        const data = getCurrentUser(credentials.access_token);
        updateUserData(data);
    }

    const updateUserData = async (data) => {
        setUser((prev) => ({ ...prev, data }))
    }

    const value = { user, updateUserCredentials, updateUserData, updateUserCookieOption }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}
