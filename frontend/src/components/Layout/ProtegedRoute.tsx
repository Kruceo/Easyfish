import { Key, ReactNode, useEffect, useState } from "react";
import { api_address, api_port, api_protocol } from "../../constants/backend/backend";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Bar from "./Bar";
import Cookies from 'js-cookie'

export function Proteged(props: { key: Key, children?: ReactNode }) {

    const navigate = useNavigate()
    const [authorized, setAuthorized] = useState<undefined | boolean>()

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(api_protocol + "://" + api_address + ":" + api_port + "/auth/validate",
                    {
                        withCredentials: true,
                        headers: { Authorization: `bearer ${window.localStorage.getItem("auth-token")}` }
                    })
                if (response.data && !response.data.error) {
                    Cookies.set("user", response.data.user, { domain: api_address })
                    setAuthorized(true)
                }

            } catch (error) {
                navigate("/login")
            }
        })()
    }, [])

    if (authorized === undefined) return <Bar />

    return <>{props.children}</>
}