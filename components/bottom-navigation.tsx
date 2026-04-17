"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Users, TrendingUp, User } from "lucide-react";

import { motion } from "framer-motion";

const navItems = [
  { path: "/", label: "Beranda", icon: Home },
  { path: "/hijaiyah", label: "Belajar", icon: BookOpen },
  { path: "/progress", label: "Progress", icon: TrendingUp },
  { path: "/profile", label: "Profil", icon: User },
];

export function BottomNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[360px] pointer-events-none">
      <nav className="glass rounded-[2rem] border-primary/10 shadow-2xl shadow-primary/20 p-2 pointer-events-auto overflow-hidden">
        <div className="flex items-center justify-around relative">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);

            return (
              <Link
                key={path}
                href={path}
                prefetch={true}
                className={cn(
                  "relative flex flex-col items-center py-3 px-4 transition-all duration-300 rounded-2xl group",
                  active ? "text-primary" : "text-muted-foreground"
                )}
                data-testid={`nav-${label.toLowerCase()}`}
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20" />
                  </motion.div>
                )}

                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-300 z-10",
                  active ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest mt-1.5 transition-all duration-300 z-10",
                  active ? "opacity-100" : "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                )}>
                  {label}
                </span>

                {active && (
                  <motion.div
                    layoutId="activeDot"
                  >
                    <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
                  </motion.div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}


