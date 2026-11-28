import { SearchProvider } from "../hooks";
import { SearchInput } from "../_components/search-input";
import { SearchResults } from "../_components/search-results";

export default function SearchProfile() {
  return (
    <SearchProvider>
      <div className="px-4 flex flex-col gap-6">
        <SearchInput />
        <SearchResults />
      </div>
    </SearchProvider>
  );
}
