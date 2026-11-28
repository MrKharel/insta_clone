import { supabase } from "@/lib/supabase";
import { userSchema } from "../_schemas/user-schema";

export async function getUser() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    console.error(userError);
    throw new Error(userError!.message);
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const parsed = userSchema.safeParse(data);
  if (parsed.error) {
    console.error(parsed.error);
    throw new Error(parsed.error.message);
  }
  return parsed.data;
}

export async function getUserWithId(id: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const parsed = userSchema.safeParse(data);
  if (parsed.error) {
    console.error(parsed.error);
    throw new Error(parsed.error.message);
  }
  return parsed.data;
}

export async function getUsers(handle: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .ilike("handle", `%${handle}%`);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const parsed = userSchema.array().safeParse(data);
  if (parsed.error) {
    console.error(parsed.error);
    throw new Error(parsed.error.message);
  }
  return parsed.data;
}
