"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

// Fade the new page in only. An exit animation (AnimatePresence mode="wait")
// held every navigation back by its full duration before the next page could
// even start rendering.
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <motion.div
      key={pathname}
      initial={isHydrated ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      <div className="w-full min-h-screen">
        {children}
      </div>
    </motion.div>
  );
}
