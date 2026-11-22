import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import { RootLayout, ProtectedLayout, AuthLayout } from "./components/layouts";

const Home = lazy(() => import("./routes/home"));
const Profile = lazy(() => import("./routes/profile"));
const SearchProfile = lazy(() => import("./routes/search-profile"));

const Login = lazy(() => import("./routes/login"));
const Signup = lazy(() => import("./routes/signup"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Navigate to="/app" /> },
      {
        path: "/app",
        element: <ProtectedLayout />,
        children: [
          { path: "", element: <Home /> },
          { path: "profile", element: <Profile /> },
          { path: "search", element: <SearchProfile /> },
        ],
      },

      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "signup", element: <Signup /> },
        ],
      },
    ],
  },
]);

export default router;
