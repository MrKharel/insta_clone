import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import { RootLayout, ProtectedLayout, AuthLayout } from "./components/layouts";

const Home = lazy(() => import("./routes/home"));
const UserProfile = lazy(() => import("./routes/profile.user"));
const PublicProfile = lazy(() => import("./routes/profile.others"));
const SearchProfile = lazy(() => import("./routes/search-profile"));

const Login = lazy(() => import("./routes/auth.login"));
const Signup = lazy(() => import("./routes/auth.signup"));

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
          { path: "profile", element: <UserProfile /> },
          { path: "profile/:id", element: <PublicProfile /> },
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
