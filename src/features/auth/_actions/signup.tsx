import { supabase } from "@/lib/supabase";

export async function signup(email: string, password: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { handle: email.split("@")[0] } },
  });
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return true;
}
