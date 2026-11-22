import { Outlet } from "react-router";

export const RootLayout = () => {
  return (
    <div className="bg-background sm:max-w-3xl w-full min-h-screen mx-auto sm:border-x shadow-x p-4 overflow-hidden *:w-full *:sm:max-3xl">
      <Outlet />
    </div>
  );
};
