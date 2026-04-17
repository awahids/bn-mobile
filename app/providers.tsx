"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";

// Query client configuration matching the original
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: async ({ queryKey }) => {
          const res = await fetch(queryKey.join("/") as string, {
            credentials: "include",
          });

          if (!res.ok) {
            const text = (await res.text()) || res.statusText;
            throw new Error(`${res.status}: ${text}`);
          }

          return await res.json();
        },
        refetchInterval: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Create query client in state to avoid SSR issues
  const [queryClient] = useState(() => createQueryClient());

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
