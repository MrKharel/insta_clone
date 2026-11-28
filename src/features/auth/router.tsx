import { lazy } from "react";
import { Navigate, Outlet, type RouteObject } from "react-router";

import { useSession } from "./hooks";

const Login = lazy(() => import("./routes/login-page"));
const Signup = lazy(() => import("./routes/signup-page"));

const AuthProvider = () => {
  const { data: session, isPending } = useSession();
  if (!isPending && session) return <Navigate to="/app" replace />;
  return (
    <div className="max-w-sm mx-auto mt-20 px-4">
      <Outlet />
    </div>
  );
};

export const authRoutes: RouteObject = {
  path: "auth",
  element: <AuthProvider />,
  children: [
    { index: true, element: <Navigate to="/auth/login" replace /> },
    { path: "login", element: <Login /> },
    { path: "signup", element: <Signup /> },
  ],
};
