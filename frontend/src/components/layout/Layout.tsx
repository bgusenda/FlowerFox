import { Header } from "../header/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function Layout() {

//    let user = sessionStorage.getItem("UserToken")
    const navigate = useNavigate()

    useEffect(() => {
            navigate("/")
    }, [])
    

    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}