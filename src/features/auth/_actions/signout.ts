import { supabase } from "@/lib/supabase";
import { redirect } from "react-router";

export const signout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  redirect("/auth/login");
};
