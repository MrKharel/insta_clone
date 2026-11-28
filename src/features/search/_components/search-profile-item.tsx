import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  id: string;
  avatar_url: string | null;
  handle: string;
  display_name: string | null;
};

export const SearchProfileItem = ({
  id,
  avatar_url,
  handle,
  display_name,
}: Props) => {
  return (
    <Link to={`/app/profile/${id}`} className="flex gap-2 items-center w-full">
      <Avatar size="lg">
        <AvatarImage src={avatar_url ?? undefined} />
        <AvatarFallback>{handle.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="text-sm">
        <p className="font-bold">{display_name}</p>
        <p className="italic">{handle}</p>
      </div>
    </Link>
  );
};
