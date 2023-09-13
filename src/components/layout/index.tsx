import { Outlet } from "react-router-dom";
import './index.scss'
import { Header } from "../header";

export function Layout() {
    return (
        <>
        <Header />
        <div className="box">
            <Outlet />
        </div>
        </>
    )
}