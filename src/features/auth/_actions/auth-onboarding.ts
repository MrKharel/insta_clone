import { supabase } from "@/lib/supabase";

export const signinWithPassword = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return { error: null, success: true };
};

export const signup = async (email: string, password: string, username: string) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { handle: username } },
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return { error: null, success: true };
};
