type Props = {
  metadata: {
    handle: string;
    display_name: string | null;
    bio: string | null;
    website: string | null;
    created_at: string;
  };
};

export const ProfileMetadata = ({ metadata: profile }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm">
        <p className="font-bold text-base">{profile.display_name}</p>
        <p className="italic text-sm">@{profile.handle}</p>
        <p className="text-sm">{profile.bio}</p>

        {profile.website && (
          <p className="flex gap-2 mt-1">
            <span className="italic">Website </span>
            <a className="underline underline-offset-4" href={profile.website}>
              {profile.website}
            </a>
          </p>
        )}
        <p className="flex gap-2">
          <span className="italic">Joined </span>
          {profile.created_at}
        </p>
      </div>
    </div>
  );
};
