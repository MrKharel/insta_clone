import { invoke } from "@tauri-apps/api/core";
import { supabase } from "@/lib/supabase";

import type { User, UpdateUser } from "../_schemas/user-schema";

const AVATAR_BUCKET = "avatars";

export const updateUser = async ({
  avatar_url,
  ...fields
}: UpdateUser): Promise<User | undefined> => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error(authError);
    throw new Error(authError!.message) ?? new Error("Not authenticated");
  }

  const updates: Partial<User> = { ...fields };

  if (avatar_url) {
    const path = `${user.id}/avatar_url-${Date.now()}.webp`;
    const bytes = new Uint8Array(await avatar_url.arrayBuffer());
    const imageBytes = await invoke<ArrayBuffer>("convert_to_webp", bytes, {
      headers: { "x-max-size-kb": String(200) },
    });

    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, new Uint8Array(imageBytes), {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) {
      console.error(uploadError);
      throw new Error(uploadError.message);
    }

    updates.avatar_url = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(path).data.publicUrl;
  }

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
};
