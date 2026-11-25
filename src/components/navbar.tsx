import { HomeIcon, PlusIcon, SearchIcon, User2Icon } from "lucide-react";
import { NavLink, type NavLinkProps } from "@/components/ui/nav-link";

const NAV_ITEMS: NavLinkProps[] = [
  { label: "Home", icon: HomeIcon, path: "/app/feed" },
  { label: "Create", icon: PlusIcon, path: "/app/create" },
  { label: "Search", icon: SearchIcon, path: "/app/search" },
  { label: "Profile", icon: User2Icon, path: "/app/profile" },
];

export const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 grid grid-cols-4 items-center w-full max-w-3xl py-2 border-t bg-background">
      {NAV_ITEMS.map((item, index) => (
        <NavLink key={index} {...item} />
      ))}
    </nav>
  );
};
