import { createBrowserRouter } from "react-router-dom";
import { Register } from "./pages/register";
import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { Profile } from "./pages/profile";
import { Login } from "./pages/login";
import { Private } from "./routes/Private";
import { Post } from "./pages/profile/post";
import { PostDetail } from "./pages/post";

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
            path: "/",
            element: <Home />
        },
        {
            path: "/profile/:uid",
            element: <Profile />
        },
        {
            path: "/profile/post",
            element: <Private><Post /></Private>
        },
        {
            path: "/post/:id",
            element: <PostDetail />
        }
        ]
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    
])

export { router }