const fileUrl = 'http://ipv4.download.thinkbroadband.com/512MB.zip'
export const speedTest = async () => {

    const startTime = Date.now();
    const download = await fetch(fileUrl);
    console.log(download);
    const endTime = Date.now();

    const speed = (200 * 300 * 8) / (endTime - startTime);

    console.log("internet speed", speed);

    return speed;

}