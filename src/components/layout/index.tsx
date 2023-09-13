import { Outlet } from "react-router-dom";
import './index.scss'
import { Header } from "../header";
import { Sidebar } from "../sidebar";
import { Navbar } from "../navbar";

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