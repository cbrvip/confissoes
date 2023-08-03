import { Outlet } from "react-router-dom";
import './index.scss'
import { Navbar } from "../navbar";
import { Sidebar } from "../sidebar";

export function Layout() {
    return (
        <div className="box">
            <Navbar />
            <Outlet />
            <Sidebar />
        </div>
    )
}