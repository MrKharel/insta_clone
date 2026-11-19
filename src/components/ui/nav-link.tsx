import { memo } from "react";
import { Link, useLocation } from "react-router";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type NavLinkProps = {
  path: string;
  icon: LucideIcon;
  label?: string;
};

export const NavLink = memo(function ({ path, icon: Icon }: NavLinkProps) {
  const { pathname } = useLocation();
  const isActive = pathname === path;

  return (
    <div
      className={cn(
        "mx-auto group",
        isActive
          ? "text-sidebar-accent-foreground"
          : "text-muted-foreground hover:text-sidebar-accent-foreground",
      )}
    >
      <Link
        to={path}
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-1",
          "rounded-lg px-2 py-2 text-xs font-medium transition-colors w-fit mx-auto group-hover:bg-sidebar-accent",
          isActive && "bg-sidebar-accent",
        )}
      >
        <Icon className="size-5" />
      </Link>
    </div>
  );
});
