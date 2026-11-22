import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchProfile, fetchUserProfile, updateProfile } from "../_actions/profile";

const PROFILE_KEY = ["profile"] as const;

export const useProfile = () => useQuery({ queryKey: PROFILE_KEY, queryFn: fetchUserProfile });

export const useQueryProfiles = ({
  handle,
  enabled = true,
}: {
  handle: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: ["profiles", "search", handle] as const,
    queryFn: () => fetchProfile(handle),
    enabled,
  });

export const useProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(PROFILE_KEY, profile);
    },
  });
};
