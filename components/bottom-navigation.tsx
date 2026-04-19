"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, TrendingUp, User } from "lucide-react";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const navItems = [
  { path: "/", label: "Beranda", icon: Home },
  { path: "/hijaiyah", label: "Belajar", icon: BookOpen },
  { path: "/progress", label: "Progress", icon: TrendingUp },
  { path: "/profile", label: "Profil", icon: User },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[400px] pointer-events-none">
      <nav className="glass rounded-[2.5rem] border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-1.5 pointer-events-auto overflow-hidden">
        <div className="flex items-center justify-between relative px-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);

            return (
              <Link
                key={path}
                href={path}
                prefetch={true}
                className={cn(
                  "relative flex flex-col items-center justify-center min-w-[64px] h-12 px-3 transition-all duration-500 rounded-[1.75rem] group outline-none",
                  active ? "text-primary flex-[1.6]" : "text-muted-foreground flex-1"
                )}
                data-testid={`nav-${label.toLowerCase()}`}
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

