const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";


function generateSiteMap(locations) {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       ${locations
            .map(({ slug }) => {
                return `
         <url>
             <loc>${`https://www.wifiandcoffee.club/location/${slug}`}</loc>
             <priority>0.75</priority>
         </url>
       `;
            })
            .join('')}
     </urlset>
   `;
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
    // We make an API call to gather the URLs for our site
    const response = await fetch(DIRECTUS_DOMAIN + "/items/locations?limit=-1");
    const { data } = await response.json();

    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap(data);

    res.setHeader('Content-Type', 'text/xml');
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default SiteMap;