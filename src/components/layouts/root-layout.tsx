import { Outlet } from "react-router";

export const RootLayout = () => {
  return (
    <div className="bg-background sm:max-w-3xl w-full min-h-screen mx-auto sm:border-x shadow-x p-2">
      <Outlet />
    </div>
  );
};
