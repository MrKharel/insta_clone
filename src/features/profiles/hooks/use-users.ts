import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser, getUserWithId, getUsers } from "../_actions/get-user";
import { updateUser } from "../_actions/update-user";
import { toast } from "@/components/ui/toast";

const USER_PROFILE_KEY = ["profile", "user"] as const;

export const useUser = () => {
  return useQuery({
    queryKey: USER_PROFILE_KEY,
    queryFn: getUser,
    staleTime: Infinity,
  });
};

export const useUserWithId = (id: string) => {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => getUserWithId(id),
  });
};

export const useUsers = (handle: string) => {
  return useQuery({
    queryKey: ["profile", handle] as const,
    queryFn: () => getUsers(handle),
    staleTime: 5 * 60 * 1000,
  });
};

export const useQueryProfiles = ({
  handle,
  enabled = true,
}: {
  handle: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: ["profiles", "search", handle] as const,
    queryFn: () => getUsers(handle),
    enabled,
  });

export const useUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onError: (error) => {
      console.error(error);
      toast.add({ title: "Unexpected error occured. Please try again." });
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(USER_PROFILE_KEY, profile);
    },
  });
};
