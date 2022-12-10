//https://rapidapi.com/geoapify-gmbh-geoapify/api/address-completion/

export default async function getAddress(req, res) {
    // if (!process.env.RAPID_API_KEY) return;
    console.log(process.env.RAPID_API_KEY);
    const { text, longitude, latitude } = req.body;
    console.log(text, longitude, latitude)
    let url = `https://address-completion.p.rapidapi.com/v1/geocode/autocomplete?text=${text}&limit=5&lang=en`;
    if (longitude) url += `&lon=${longitude}`;
    if (latitude) url += `&lat=${latitude}`;
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": process.env.RAPID_API_KEY,
            "X-RapidAPI-Host": "address-completion.p.rapidapi.com",
        },
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        // console.log(data);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("error with request");
    }
}
