import { useProfile } from "@/features/profile/hooks";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileStats } from "./profile-stats";
import { ProfileMetadata } from "./profile-metadata";
import { ProfileAvatar } from "./profile-avatar";

import type { Dispatch, SetStateAction } from "react";

type Props = {
  setEditMode: Dispatch<SetStateAction<boolean>>;
};

export const ProfileInfo = ({ setEditMode }: Props) => {
  const { data: profile, isLoading } = useProfile();

  if (isLoading || !profile) {
    return (
      <div className="flex items-center gap-6 border-b-4 border-double pb-8 md:gap-16">
        <Skeleton className="size-20 shrink-0 rounded-full md:size-36" />
        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-start gap-6 border-b-2 border-double pb-8 md:gap-16">
      <div className="flex gap-6 items-start">
        <ProfileAvatar initials={profile.handle.slice(0, 2)} avatar_url={profile.avatar_url} />

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {/* Profile Names: handle and display_name */}
          <div className="flex flex-col gap-0.5">
            {profile.display_name && (
              <p className="font-semibold text-foreground">{profile.display_name}</p>
            )}

            <h1 className="truncate text-sm font-light text-foreground md:text-2xl">
              @{profile.handle}
            </h1>
          </div>

          <ProfileStats />
          <ProfileMetadata />
        </div>
      </div>

      <Button variant="outline" onClick={() => setEditMode(true)} className="w-full">
        Edit Profile
      </Button>
    </section>
  );
};
