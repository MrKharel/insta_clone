import { useState } from "react";
import { useSearch } from "../hooks";

import { LogInIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchInput = () => {
  const [value, setValue] = useState("");
  const { setQuery } = useSearch();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setQuery(value);
      }}
      className="flex gap-2"
    >
      <Input
        className="w-full h-10 text-[16px]"
        placeholder="Search other users via handle"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button type="submit" variant="outline" className="h-10">
        <LogInIcon />
      </Button>
    </form>
  );
};
