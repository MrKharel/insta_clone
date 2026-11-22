import { useState } from "react";

import { CameraIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PickNewProfile } from "./pick-new-profile";

type ProfileAvatarProps = {
  avatar_url: string | null;
  initials: string;
};

export const ProfileAvatar = ({ avatar_url, initials }: ProfileAvatarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Change profile picture"
        className="group relative shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Avatar className="size-20 md:size-36">
          <AvatarImage src={avatar_url ?? undefined} alt={initials} />
          <AvatarFallback className="bg-muted text-2xl text-muted-foreground md:text-5xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/50 text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <CameraIcon className="size-6 md:size-8" />
        </span>
      </button>

      <PickNewProfile open={open} setOpen={setOpen} initials={initials} avatar_url={avatar_url} />
    </>
  );
};
