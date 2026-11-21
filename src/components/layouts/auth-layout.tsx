import { Navigate, Outlet } from "react-router";
import { useSession } from "@/hooks/use-session";

export const AuthLayout = () => {
  const { data: session, isPending } = useSession();

  if (isPending) return null; // or a spinner
  if (session) return <Navigate to="/" replace />;

  return (
    <div className="w-full max-w-sm mx-auto mt-14">
      <Outlet />
    </div>
  );
};
