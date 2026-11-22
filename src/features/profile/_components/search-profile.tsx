import { useEffect, useState } from "react";
import { SearchIcon, UserSearchIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryProfiles } from "../hooks";

const DEBOUNCE_MS = 300;

const useDebouncedValue = <T,>(value: T, delay: number) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
};

export const SearchProfile = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);

  const hasQuery = query.length > 0;
  const isSettled = query === debouncedQuery;

  const { data: profiles = [], isFetching } = useQueryProfiles({
    handle: debouncedQuery,
    enabled: debouncedQuery.length > 0,
  });

  const isLoading = hasQuery && (!isSettled || isFetching) && profiles.length === 0;

  return (
    <div className="flex w-full w-fit mx-auto flex-col gap-4">
      <div className="relative">
        <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by handle"
          className="pl-9"
          autoComplete="off"
        />
      </div>

      {!hasQuery ? (
        <EmptyState message="Search for a profile by its handle." />
      ) : isLoading ? (
        <ProfileSkeletons />
      ) : profiles.length === 0 ? (
        <EmptyState message="No profiles found." />
      ) : (
        <ul className="flex flex-col gap-1">
          {profiles.map((profile) => (
            <li key={profile.id} className="hover:bg-muted flex items-center gap-3 rounded-md p-2">
              <Avatar>
                <AvatarImage src={profile.avatar_url ?? ""} alt={profile.handle} />
                <AvatarFallback>{profile.handle.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">
                  {profile.display_name ?? "User"}
                </span>
                <span className="text-muted-foreground truncate text-xs">@{profile.handle}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-muted-foreground flex flex-col items-center gap-2 py-10 text-sm">
    <UserSearchIcon className="size-8" />
    <p>{message}</p>
  </div>
);

const ProfileSkeletons = () => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-2">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    ))}
  </div>
);
