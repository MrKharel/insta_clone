import { supabase } from "@/lib/supabase";
import type { ActionResult } from "./types";

export type LikeStatus = {
  count: number;
  liked: boolean; // whether the current user has liked the post
};

// ---------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------
export async function getLikeStatus(
  postId: string,
): Promise<ActionResult<LikeStatus>> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count, error: countError } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);
  if (countError) return { ok: false, error: countError.message };

  let liked = false;
  if (user) {
    const { data, error: likedError } = await supabase
      .from("likes")
      .select("post_id")
      .eq("post_id", postId)
      .eq("profile_id", user.id)
      .maybeSingle();
    if (likedError) return { ok: false, error: likedError.message };
    liked = data !== null;
  }

  return { ok: true, data: { count: count ?? 0, liked } };
}

// ---------------------------------------------------------------------
// Like
// ---------------------------------------------------------------------
export async function likePost(postId: string): Promise<ActionResult<null>> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("likes")
    .insert({ profile_id: user.id, post_id: postId });

  // 23505 = already liked, which is the state we wanted anyway
  if (error && error.code !== "23505") {
    return { ok: false, error: error.message };
  }
  return { ok: true, data: null };
}

// ---------------------------------------------------------------------
// Unlike
// ---------------------------------------------------------------------
export async function unlikePost(postId: string): Promise<ActionResult<null>> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("profile_id", user.id)
    .eq("post_id", postId);
  if (error) return { ok: false, error: error.message };

  return { ok: true, data: null };
}
