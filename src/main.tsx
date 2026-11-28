import "./globals.css";
import React from "react";
import ReactDOM from "react-dom/client";
import app from "./app";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "@/components/ui/theme-toggle";
import { Toaster } from "@/components/ui/toast";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster>
          <RouterProvider router={app} />
        </Toaster>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
