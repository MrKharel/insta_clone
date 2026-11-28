import { lazy } from "react";
import { type RouteObject } from "react-router";

const Search = lazy(() => import("./routes/search-page"));

export const searchRoutes: RouteObject = {
  path: "search",
  element: <Search />,
};
