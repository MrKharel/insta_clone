import { lazy } from "react";
import { Outlet, type RouteObject } from "react-router";

const UserProfile = lazy(() => import("./routes/user-profile"));
const PublicProfile = lazy(() => import("./routes/public-profile"));

export const profileRoutes: RouteObject[] = [
  {
    path: "profile",
    element: (
      <div>
        <Outlet />
      </div>
    ),
    children: [
      { index: true, element: <UserProfile /> },
      { path: ":id", element: <PublicProfile /> },
    ],
  },
];
