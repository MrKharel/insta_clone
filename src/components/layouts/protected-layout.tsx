import { Navigate, Outlet } from "react-router";
import { useSession } from "@/hooks/use-session";

export const ProtectedLayout = () => {
  const { data: session, isPending } = useSession();

  if (isPending) return null;
  if (!session) return <Navigate to="/auth/login" replace />;

  return <Outlet />;
};
