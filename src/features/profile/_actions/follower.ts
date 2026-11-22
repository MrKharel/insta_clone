import z from "zod";
import { supabase } from "@/lib/supabase";

const FOLLOWER_TABLE = "follower";
const FOLLOWER_SELECTS = "*";

const FollowerQuery = z.object({
  follower_id: z.string(),
  following_id: z.string(),
  followed_at: z.string(),
});

type Follower = z.infer<typeof FollowerQuery>;

export const getFollowers = async (
  userId?: string,
): Promise<Array<Follower>> => {
  if (userId) {
    const { data, error } = await supabase
      .from(FOLLOWER_TABLE)
      .select(FOLLOWER_SELECTS)
      .eq("follower_id", userId);
    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    const followers = FollowerQuery.array().safeParse(data);
    if (followers.error) {
      console.error(error);
      throw new Error(followers.error.message);
    }
    return followers.data;
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (!user || authError) {
    console.error(authError);
    throw new Error(authError?.message ?? "");
  }

  const { data, error } = await supabase
    .from(FOLLOWER_TABLE)
    .select(FOLLOWER_SELECTS)
    .eq("follower_id", user.id);
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const followers = FollowerQuery.array().safeParse(data);
  if (followers.error) {
    console.error(error);
    throw new Error(followers.error.message);
  }
  return followers.data;
};

export const getFollowings = async (userId?: string) => {
  if (userId) {
    const { data, error } = await supabase
      .from(FOLLOWER_TABLE)
      .select(FOLLOWER_SELECTS)
      .eq("following_id", userId);
    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    const followers = FollowerQuery.array().safeParse(data);
    if (followers.error) {
      console.error(error);
      throw new Error(followers.error.message);
    }
    return followers.data;
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (!user || authError) {
    console.error(authError);
    throw new Error(authError?.message ?? "");
  }

  const { data, error } = await supabase
    .from(FOLLOWER_TABLE)
    .select(FOLLOWER_SELECTS)
    .eq("following_id", user.id);
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const followers = FollowerQuery.array().safeParse(data);
  if (followers.error) {
    console.error(error);
    throw new Error(followers.error.message);
  }
  return followers.data;
};

export const followUser = async (followingId: string): Promise<Follower> => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (!user || authError) {
    console.error(authError);
    throw new Error(authError?.message ?? "");
  }

  if (user.id === followingId) {
    throw new Error("You cannot follow yourself");
  }

  const { data, error } = await supabase
    .from(FOLLOWER_TABLE)
    .insert({ follower_id: user.id, following_id: followingId })
    .select(FOLLOWER_SELECTS)
    .single();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const follower = FollowerQuery.safeParse(data);
  if (follower.error) {
    console.error(follower.error);
    throw new Error(follower.error.message);
  }
  return follower.data;
};

export const unfollowUser = async (followingId: string): Promise<boolean> => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (!user || authError) {
    console.error(authError);
    throw new Error(authError?.message ?? "");
  }

  const { error } = await supabase
    .from(FOLLOWER_TABLE)
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", followingId);
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return true;
};
