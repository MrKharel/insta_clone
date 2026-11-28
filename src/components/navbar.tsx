import { cn } from "cn";
import {
  FilmIcon,
  HomeIcon,
  SearchIcon,
  SendIcon,
  UserIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router";

const NAV_ITEMS = [
  { path: "/app/home", icon: HomeIcon },
  { path: "/app/reels", icon: FilmIcon },
  { path: "/app/inbox", icon: SendIcon },
  { path: "/app/search", icon: SearchIcon },
  { path: "/app/profile", icon: UserIcon },
];

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full px-1 pb-4 grid grid-cols-5 items-center border-t">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-all duration-200 text-muted-foreground hover:text-foreground",
              isActive && "text-black dark:text-white",
            )}
          >
            <Icon
              className={cn(
                "size-5 transition-transform duration-200",
                isActive && "scale-110",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
};
