import { createBrowserRouter } from "react-router-dom";
import { Register } from "./pages/register";

import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { Profile } from "./pages/profile";


const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
            path: "/",
            element: <Home />
        },
        {
            path: "/profile",
            element: <Profile />
        }
        ]
    },
    {
        path: "/register",
        element: <Register />
    }
])

export { router }