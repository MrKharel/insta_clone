import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createPost,
  getPost,
  getPosts,
  updatePost,
  type CreatePostInput,
  type UpdatePostInput,
} from "../_actions";

export const postKeys = {
  all: ["posts"] as const,
  list: (profileId?: string) =>
    [...postKeys.all, "list", profileId ?? "all"] as const,
  detail: (id: string) => [...postKeys.all, "detail", id] as const,
};

export function usePosts(options?: { profileId?: string; limit?: number }) {
  return useInfiniteQuery({
    queryKey: postKeys.list(options?.profileId),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const res = await getPosts({
        profileId: options?.profileId,
        limit: options?.limit,
        cursor: pageParam,
      });
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: postKeys.detail(id ?? ""),
    enabled: !!id,
    queryFn: async () => {
      const res = await getPost(id as string);
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePostInput) => {
      const res = await createPost(input);
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
    onSuccess: (post) => {
      queryClient.setQueryData(postKeys.detail(post.id), post);
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdatePostInput) => {
      const res = await updatePost(input);
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
    onSuccess: (post) => {
      queryClient.setQueryData(postKeys.detail(post.id), post);
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
