import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getLikeStatus,
  likePost,
  unlikePost,
  type LikeStatus,
} from "../_actions";
import type { ActionResult } from "../types";

export const likeKeys = {
  all: ["likes"] as const,
  status: (postId: string) => [...likeKeys.all, "status", postId] as const,
};

// ---------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------
export function useLikeStatus(postId: string | undefined) {
  return useQuery({
    queryKey: likeKeys.status(postId ?? ""),
    enabled: !!postId,
    queryFn: async () => {
      const res = await getLikeStatus(postId as string);
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
  });
}

// ---------------------------------------------------------------------
// Like / unlike (optimistic)
// ---------------------------------------------------------------------
function useLikeMutation(
  action: (postId: string) => Promise<ActionResult<null>>,
  liked: boolean,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await action(postId);
      if (!res.ok) throw new Error(res.error);
    },
    onMutate: async (postId) => {
      const key = likeKeys.status(postId);
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<LikeStatus>(key);
      if (previous && previous.liked !== liked) {
        queryClient.setQueryData<LikeStatus>(key, {
          liked,
          count: Math.max(0, previous.count + (liked ? 1 : -1)),
        });
      }
      return { previous };
    },
    onError: (_error, postId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(likeKeys.status(postId), context.previous);
      }
    },
    onSettled: (_data, _error, postId) => {
      queryClient.invalidateQueries({ queryKey: likeKeys.status(postId) });
    },
  });
}

export function useLikePost() {
  return useLikeMutation(likePost, true);
}

export function useUnlikePost() {
  return useLikeMutation(unlikePost, false);
}
