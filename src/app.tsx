import { createHashRouter, Navigate, Outlet } from "react-router";
import { authRoutes, useLogout, useSession } from "./features/auth";
import { profileRoutes } from "./features/profiles";
import { searchRoutes } from "./features/search";
import { Navbar } from "./components/navbar";
import { ThemeToggle } from "./components/ui/theme-toggle";
import { Button } from "./components/ui/button";

const App = () => {
  const { logout } = useLogout();
  return (
    <div className="flex flex gap-2">
      <Button onClick={logout}>Logout</Button>;
      <ThemeToggle />
      <div className="text-black dark:text-white">something</div>
    </div>
  );
};

const ProtectedProvider = () => {
  const { data: session, isPending } = useSession();
  if (!isPending && !session) return <Navigate to="/auth" replace />;
  return (
    <div className="max-w-[768px] mx-auto">
      <Outlet />
      <Navbar />
    </div>
  );
};

const app = createHashRouter([
  {
    path: "/",
    element: (
      <div className="pt-10">
        <Outlet />
      </div>
    ),
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      authRoutes,
      {
        path: "app",
        element: <ProtectedProvider />,
        children: [
          { index: true, element: <Navigate to="/app/home" replace /> },
          { path: "home", element: <App /> },
          ...profileRoutes,
          searchRoutes,
        ],
      },
    ],
  },
]);

export default app;
