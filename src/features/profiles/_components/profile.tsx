import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ProfileStats } from "./profile-stats";
import { ChangeAvatar } from "./change-avatar";
import { useState } from "react";

type Props = {
  avatar_url: string | null;
  handle: string;
  isUserProfile: boolean;
};

export const Profile = ({
  avatar_url,
  handle,
  isUserProfile = false,
}: Props) => {
  const [open, setOpen] = useState(false);
  const initials = handle.slice(0, 2).toUpperCase();
  return (
    <div className="flex gap-4 justify-between px-5">
      <Avatar className="size-25" onClick={() => setOpen(true)}>
        <AvatarImage src={avatar_url ?? ""} />
        <AvatarFallback className="text-lg font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <ProfileStats
        stats={[
          { label: "Posts", value: 0 },
          { label: "Follower", value: 0 },
          { label: "Following", value: 0 },
        ]}
      />

      {isUserProfile && (
        <ChangeAvatar
          open={open}
          setOpen={setOpen}
          initials={initials}
          avatar_url={avatar_url}
        />
      )}
    </div>
  );
};
