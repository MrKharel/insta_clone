import { supabase } from "@/lib/supabase";

export type Profile = {
  id: string;
  handle: string;
  display_name: string | null;
  bio: string | null;
  website: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type ProfileUpdate = Partial<
  Pick<Profile, "handle" | "display_name" | "bio" | "website">
> & {
  avatar?: File;
};

const AVATAR_BUCKET = "avatars";

export const fetchUserProfile = async (): Promise<Profile> => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw authError ?? new Error("Not authenticated");

  const { data, error } = await supabase.from("user").select("*").eq("id", user.id).single();
  if (error) throw error;

  return data;
};

export const fetchProfile = async (
  handle: string,
): Promise<Pick<Profile, "id" | "handle" | "display_name" | "avatar_url">[]> => {
  const { data, error } = await supabase
    .from("user")
    .select("id, handle, display_name, avatar_url")
    .ilike("handle", `%${handle.toLowerCase().replace(" ", "")}%`);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  console.log({ data, handle });
  return data;
};

export const updateProfile = async ({ avatar, ...fields }: ProfileUpdate): Promise<Profile> => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw authError ?? new Error("Not authenticated");

  const updates: Partial<Profile> = { ...fields };

  if (avatar) {
    const ext = avatar.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, avatar, { contentType: avatar.type });
    if (uploadError) throw uploadError;

    updates.avatar_url = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  const { data, error } = await supabase
    .from("user")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();
  if (error) throw error;

  return data;
};
