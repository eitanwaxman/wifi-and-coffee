import { Avatar, Stack } from "@mui/material"
import { useEffect, useState } from "react";

export default function MemberAvatar({ memberId, size, name = false }) {

    const DIRECTUS_DOMAIN = "https://555qkb69.directus.app";

    const [member, setMember] = useState()

    const getMember = async () => {
        const response = await fetch(DIRECTUS_DOMAIN + "/users/" + memberId);
        const memberData = await response.json();
        console.log(memberData);
        if (memberData) setMember(memberData.data)
    }

    useEffect(() => {
        getMember();
    }, [memberId])

    return (<>
        <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{width: size, height: size}} src={member?.image} alt={member?.firstName + " " + member?.lastName}></Avatar>
            {name && <p style={{fontSize: `${size/1.5}px`}}>{member?.first_name}</p>}
        </Stack>
    </>)
}