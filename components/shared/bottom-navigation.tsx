"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, TrendingUp, User } from "lucide-react";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

type NavItem = {
  path: string;
  label: string;
  icon: typeof Home;
  isActive: (pathname: string) => boolean;
};

const LEARNING_ROUTE_PREFIXES = [
  "/modules",
  "/hijaiyah",
  "/quran",
  "/dhikr",
  "/quiz",
  "/habits",
];

const navItems = [
  {
    path: "/",
    label: "Beranda",
    icon: Home,
    isActive: (pathname: string) => pathname === "/",
  },
  {
    path: "/modules",
    label: "Belajar",
    icon: BookOpen,
    isActive: (pathname: string) =>
      LEARNING_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix)),
  },
  {
    path: "/progress",
    label: "Progress",
    icon: TrendingUp,
    isActive: (pathname: string) => pathname.startsWith("/progress"),
  },
  {
    path: "/profile",
    label: "Profil",
    icon: User,
    isActive: (pathname: string) => pathname.startsWith("/profile"),
  },
] satisfies NavItem[];

export function BottomNavigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const bottomOffset = "max(0.75rem, env(safe-area-inset-bottom))";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-50"
      style={{ bottom: bottomOffset, width: "min(92vw, 28rem)" }}
    >
      <nav className="glass rounded-[2.5rem] border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-1.5 overflow-hidden">
        <div className="flex items-center justify-between relative px-1">
          {navItems.map(({ path, label, icon: Icon, isActive }) => {
            const active = pathname ? isActive(pathname) : false;

            return (
              <Link
                key={path}
                href={path}
                prefetch={true}
                className={cn(
                  "relative flex flex-col items-center justify-center min-w-[64px] h-12 px-3 transition-all duration-500 rounded-[1.75rem] group outline-none touch-manipulation",
                  active ? "text-primary flex-[1.6]" : "text-muted-foreground flex-1"
                )}
                data-testid={`nav-${label.toLowerCase()}`}
                aria-current={active ? "page" : undefined}
                aria-label={label}
              >
                <motion.div whileTap={{ scale: 0.9 }}>
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      >
                        <div className="absolute inset-0 bg-primary/10 rounded-[1.75rem] border border-primary/20 z-0" />
                      </motion.div>
                    )}

                    <div className="relative z-10 flex flex-col items-center">
                      <Icon className={cn(
                        "w-5 h-5 transition-all duration-500",
                        active ? "scale-110 stroke-[2.5px]" : "group-hover:scale-110 stroke-[2px]"
                      )} />

                      {active && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
                            {label}
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {active && (
                      <motion.div
                        layoutId="activeDot"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      >
                        <div className="absolute -bottom-1 w-1.5 h-1.5 bg-primary rounded-full z-20" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
