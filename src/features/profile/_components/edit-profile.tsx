import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { Profile, ProfileUpdate } from "@/features/profile/_actions/profile";
import { useProfile, useProfileMutation } from "@/features/profile/hooks";

type ProfileEditProps = {
  onCancel?: () => void;
  onSaved?: () => void;
};

type ProfileEditFormProps = ProfileEditProps & {
  profile: Profile;
};

const EditProfileForm = ({ profile, onCancel, onSaved }: ProfileEditFormProps) => {
  const { mutate, isPending, error } = useProfileMutation();

  const [handle, setHandle] = useState(profile.handle);
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [website, setWebsite] = useState(profile.website ?? "");

  const handleChanged = handle !== profile.handle;
  const displayNameChanged = displayName !== (profile.display_name ?? "");
  const bioChanged = bio !== (profile.bio ?? "");
  const websiteChanged = website !== (profile.website ?? "");
  const isDirty = handleChanged || displayNameChanged || bioChanged || websiteChanged;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isDirty) return;

    const updates: ProfileUpdate = {};
    if (handleChanged) updates.handle = handle;
    if (displayNameChanged) updates.display_name = displayName;
    if (bioChanged) updates.bio = bio;
    if (websiteChanged) updates.website = website;

    mutate(updates, { onSuccess: () => onSaved?.() });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-start gap-6 border-b-4 border-double pb-8 md:gap-16"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <h1 className="text-xl font-light text-foreground md:text-2xl">Edit profile</h1>

        <div className="flex flex-col gap-2">
          <Label htmlFor="handle">Handle</Label>
          <Input
            id="handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            disabled={isPending}
            autoComplete="off"
            contentEditable={false}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="display_name">Name</Label>
          <Input
            id="display_name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={isPending}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            disabled={isPending}
            placeholder="https://"
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={isPending}
            rows={4}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error.message}
          </p>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={!isDirty || isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export const EditProfile = (props: ProfileEditProps) => {
  const { data: profile, isLoading } = useProfile();

  if (isLoading || !profile) {
    return (
      <div className="flex items-start gap-6 border-b-4 border-double pb-8 md:gap-16">
        <Skeleton className="size-20 shrink-0 rounded-full md:size-36" />
        <div className="flex flex-1 flex-col gap-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return <EditProfileForm profile={profile} {...props} />;
};
