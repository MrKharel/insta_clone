import { useEffect, memo } from "react";
import { useSearchParams } from "react-router";
import { useSearch } from "../hooks";
import { useUsers } from "@/features/profiles";

import { SearchProfileItem } from "./search-profile-item";

export const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { query } = useSearch();

  useEffect(() => {
    setSearchParams((prev) => {
      prev.set("q", query);
      return prev;
    });
  }, [query]);

  const q = searchParams.get("q");
  if (!q || q === "") return null;

  return <Results query={q} />;
};

const Results = memo(({ query }: { query: string }) => {
  const { data: profiles, isFetching } = useUsers(query);
  if (isFetching) return <>Loading...</>;
  if (!profiles) return <>No profiles</>;

  return (
    <div className="flex flex-col gap-2">
      {profiles.map((profile, index) => (
        <SearchProfileItem key={index} {...profile} />
      ))}
    </div>
  );
});
