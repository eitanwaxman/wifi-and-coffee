// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {

  const TOKEN = process.env.DIRECTUS_TOKEN;
  const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";

  const { email, password } = req.body;
  const addNewUser = async (email, password) => {
    const body = {
      email,
      password,
      role: "59895a93-f1a9-42f0-ac05-345577a3e75f",
    };
    console.log(body);
    const options = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    const response = await fetch(DIRECTUS_DOMAIN + "/users", options);
    const data = await response.json();
    console.log(data);
  };

  try {
    addNewUser(email, password);
    res.status(200).json({ message: "user registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
}
