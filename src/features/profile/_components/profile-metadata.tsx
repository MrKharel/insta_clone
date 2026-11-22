type ProfileMetadataProps = {
  bio?: string;
  website?: string;
  joined_at?: string;
};

export const ProfileMetadata = ({ bio, website, joined_at }: ProfileMetadataProps) => {
  return (
    <div className="flex flex-col gap-1 text-sm">
      {bio && <p className="whitespace-pre-line text-foreground">{bio}</p>}

      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate font-medium text-primary hover:underline"
        >
          {website}
        </a>
      )}

      {joined_at && <p className="text-xs text-muted-foreground">Joined {joined_at}</p>}
    </div>
  );
};
