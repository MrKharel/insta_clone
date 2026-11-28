import { formatTimestamp } from "@/lib/utils/format-time";
import { Link } from "react-router";

type Props = {
  handle: string;
  display_name: string | null;
  email?: string;
  bio: string | null;
  joined_at: string;
  website?: string | null;
};

export const ProfileMetadata = ({
  handle,
  display_name,
  email,
  website,
  bio,
  joined_at,
}: Props) => {
  return (
    <div className="text-base pt-3 px-5">
      <p className="items-center">
        {display_name && (
          <span className="text-lg font-semibold">{display_name} · </span>
        )}
        <span className="italic">{handle}</span>
      </p>
      {email && <p>{email}</p>}
      {bio && <p>{bio}</p>}

      {website && (
        <p className="mt-2 line-clamp-1">
          Website <Link to={website}>{website}</Link>
        </p>
      )}
      <p>Joined {formatTimestamp(joined_at)}</p>
    </div>
  );
};
