import { HomeIcon } from "lucide-react";
import { NavLink, type NavLinkProps } from "@/components/ui/nav-link";

const NAV_ITEMS: NavLinkProps[] = [
  { label: "Home", icon: HomeIcon, path: "/" },
];

export const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 grid grid-cols-4 items-center w-full max-w-4xl py-2 border-t">
      {NAV_ITEMS.map((item, index) => (
        <NavLink key={index} {...item} />
      ))}
    </nav>
  );
};
