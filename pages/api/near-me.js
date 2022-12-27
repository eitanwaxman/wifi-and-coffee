
export default async function handler(req, res) {

    const TOKEN = process.env.DIRECTUS_TOKEN;
    const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";

    const { longitude, latitude } = req.body;
    const findLocationsNearMe = async (longitude, latitude) => {
        const top = longitude + 0.5;
        const bottom = longitude - 0.5;
        const left = latitude - 0.5;
        const right = latitude + 0.5;

        console.log(top, bottom, left, right)
        const options = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + TOKEN,
                "Content-Type": "application/json",
            },
        };
        const response = await fetch(DIRECTUS_DOMAIN + `/items/locations?filter[longitude][_between]=${bottom},${top}&filter[latitude][_between]=${left},${right}`, options);
        const data = await response.json();
        console.log(data);
        return data;
    };

    try {
        const locations =  await findLocationsNearMe(longitude, latitude);
        res.status(200).json(locations);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
}


//?filter[longitude][_lt]=${top}&filter[longitude][_gt]=${bottom}&filter[latitude][_gt]=${left}&filter[latitude][_lt]=${right}
//-73.99012