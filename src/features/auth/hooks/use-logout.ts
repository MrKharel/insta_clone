import { useState } from "react";
import { logout as logoutAction } from "../_actions/logout";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutAction();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
};
