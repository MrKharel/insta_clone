import { supabase } from "@/lib/supabase";

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return true;
}
