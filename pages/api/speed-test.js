// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const { exec } = require("child_process");

export default function handler(req, res) {
    exec("speed-test --json", (err, stdout, stderr) => {
        // if (err || stderr) return res.send(
        //     "Error while testing internet speed.");
        console.log(err, stdout, stderr);
        const result = JSON.parse(stdout);
        console.log(result);
        res.status(200).json(result)
    });


}
