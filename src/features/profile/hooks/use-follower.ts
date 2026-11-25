import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  followUser,
  getFollowers,
  getFollowings,
  unfollowUser,
} from "../_actions/follower";

export const followerKeys = {
  all: ["follower"] as const,
  followers: (userId?: string) =>
    [...followerKeys.all, "followers", userId ?? "me"] as const,
  followings: (userId?: string) =>
    [...followerKeys.all, "followings", userId ?? "me"] as const,
};

export const useFollowers = (userId?: string) => {
  return useQuery({
    queryKey: followerKeys.followers(userId),
    queryFn: () => getFollowers(userId),
  });
};

export const useFollowings = (userId?: string) => {
  return useQuery({
    queryKey: followerKeys.followings(userId),
    queryFn: () => getFollowings(userId),
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followingId: string) => followUser(followingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followerKeys.all });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followingId: string) => unfollowUser(followingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followerKeys.all });
    },
  });
};
