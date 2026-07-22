"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Nav } from "@/components/Nav";
import { Providers } from "@/components/Providers";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isEmbed = pathname.startsWith("/embed");

  return (
    <Providers>
      {!isEmbed ? <Nav /> : null}
      <div className="flex-1">{children}</div>
    </Providers>
  );
}
