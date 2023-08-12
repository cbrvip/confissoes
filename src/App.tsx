import { createBrowserRouter } from "react-router-dom";
import { Register } from "./pages/register";
import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { Profile } from "./pages/profile";
import { Login } from "./pages/login";
import { Private } from "./routes/Private";
import { Post } from "./pages/profile/post";
import { PostDetail } from "./pages/post";
import { Dashboard } from "./admin/pages/dashboard";
import { LoginAdmin } from "./admin/pages/login";
import { PostsAdmin } from "./admin/pages/posts";
import { PostsAdminPending } from "./admin/pages/posts/pending";
import { PostsAdminApproved } from "./admin/pages/posts/approved";
import { NewPostAdm } from "./admin/pages/posts/new";
import { CommentAdm } from "./admin/pages/comments";

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
    {
        path: "/admin",
        element: <Private><Dashboard /></Private>
    },
    {
        path: "/admin/login",
        element: <LoginAdmin />
    },
    {
        path: "/admin/posts",
        element: <Private><PostsAdmin /></Private>
    },
    {
        path: "/admin/posts/approved",
        element: <Private><PostsAdminApproved /></Private>
    },
    {
        path: "/admin/posts/pending",
        element: <Private><PostsAdminPending /></Private>
    },
    {
        path: "/admin/posts/new",
        element: <Private><NewPostAdm /></Private>
    },
    {
        path: "/admin/comments",
        element: <Private><CommentAdm /></Private>
    }
    
    
])

export { router }